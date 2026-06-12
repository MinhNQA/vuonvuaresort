const POST_CATEGORIES = {
  discussion: { label: 'Thảo luận', flair: 'flair-discussion' },
  review: { label: 'Đánh giá', flair: 'flair-review' },
  blog: { label: 'Blog', flair: 'flair-blog' },
  news: { label: 'Tin tức', flair: 'flair-news' },
};

const DEMO_POSTS_KEY = 'vv_demo_posts';
const DEMO_COMMENTS_KEY = 'vv_demo_comments';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || `post-${Date.now()}`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function excerptFromContent(content, len = 160) {
  const plain = content.replace(/[#*_>`~\[\]()]/g, '').replace(/\n+/g, ' ').trim();
  return plain.length > len ? `${plain.slice(0, len)}…` : plain;
}

function getInitials(name) {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function renderMarkdown(text) {
  if (!text) return '';
  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
    return marked.parse(text);
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function getDemoPosts() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_POSTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveDemoPosts(posts) {
  localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(posts));
}

function getDemoComments(postId) {
  try {
    const all = JSON.parse(localStorage.getItem(DEMO_COMMENTS_KEY) || '{}');
    return all[postId] || [];
  } catch {
    return [];
  }
}

function saveDemoComment(postId, comment) {
  const all = JSON.parse(localStorage.getItem(DEMO_COMMENTS_KEY) || '{}');
  if (!all[postId]) all[postId] = [];
  all[postId].unshift(comment);
  localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(all));
}

async function fetchPublishedPosts({ category, limit = 50, order = 'published_at.desc' } = {}) {
  try {
    let query = `posts?status=eq.published&select=*&order=${order}&limit=${limit}`;
    if (category && category !== 'all') query += `&category=eq.${category}`;
    return await supabaseRest(query);
  } catch {
    return getDemoPosts().filter((p) => p.status === 'published');
  }
}

async function fetchPostBySlug(slug) {
  try {
    const rows = await supabaseRest(`posts?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
    return rows?.[0] || null;
  } catch {
    return getDemoPosts().find((p) => p.slug === slug && p.status === 'published') || null;
  }
}

async function fetchMyPosts(authorId) {
  try {
    return await authRest(`posts?author_id=eq.${authorId}&select=*&order=updated_at.desc`);
  } catch {
    return getDemoPosts().filter((p) => p.author_id === authorId);
  }
}

async function createPost(post) {
  try {
    const rows = await authRest('posts', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(post),
    });
    return Array.isArray(rows) ? rows[0] : rows;
  } catch {
    const demo = { ...post, id: `demo-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), upvotes: 0, comment_count: 0 };
    const posts = getDemoPosts();
    posts.unshift(demo);
    saveDemoPosts(posts);
    return demo;
  }
}

async function updatePost(id, updates) {
  try {
    const rows = await authRest(`posts?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    });
    return Array.isArray(rows) ? rows[0] : rows;
  } catch {
    const posts = getDemoPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Post not found');
    posts[idx] = { ...posts[idx], ...updates, updated_at: new Date().toISOString() };
    saveDemoPosts(posts);
    return posts[idx];
  }
}

async function deletePost(id) {
  try {
    await authRest(`posts?id=eq.${id}`, { method: 'DELETE' });
  } catch {
    saveDemoPosts(getDemoPosts().filter((p) => p.id !== id));
  }
}

async function fetchComments(postId) {
  try {
    return await supabaseRest(`comments?post_id=eq.${postId}&select=*&order=created_at.asc`);
  } catch {
    return getDemoComments(postId);
  }
}

async function addComment(postId, { author_name, content }) {
  const comment = { post_id: postId, author_name, content, upvotes: 0, created_at: new Date().toISOString() };
  try {
    const rows = await supabaseRest('comments', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(comment),
    });
    return Array.isArray(rows) ? rows[0] : rows;
  } catch {
    const demo = { ...comment, id: `c-${Date.now()}` };
    saveDemoComment(postId, demo);
    const posts = getDemoPosts();
    const p = posts.find((x) => x.id === postId);
    if (p) { p.comment_count = (p.comment_count || 0) + 1; saveDemoPosts(posts); }
    return demo;
  }
}

async function upvotePost(postId) {
  const key = `vv_voted_${postId}`;
  if (localStorage.getItem(key)) return null;
  try {
    const rows = await supabaseRest(`posts?id=eq.${postId}&select=upvotes&limit=1`);
    const current = rows?.[0]?.upvotes || 0;
    await supabaseRest(`posts?id=eq.${postId}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ upvotes: current + 1 }),
    });
    localStorage.setItem(key, '1');
    return current + 1;
  } catch {
    const posts = getDemoPosts();
    const p = posts.find((x) => x.id === postId);
    if (p && !localStorage.getItem(key)) {
      p.upvotes = (p.upvotes || 0) + 1;
      saveDemoPosts(posts);
      localStorage.setItem(key, '1');
      return p.upvotes;
    }
    return null;
  }
}

function postCardHtml(post) {
  const cat = POST_CATEGORIES[post.category] || POST_CATEGORIES.discussion;
  const tags = (post.tags || []).slice(0, 3).map((t) => `<span class="tag-pill">${t}</span>`).join('');
  return `
    <article class="feed-card" data-slug="${post.slug}">
      <div class="vote-col">
        <button class="vote-btn" data-vote="${post.id}" aria-label="Upvote">▲</button>
        <span class="vote-count" id="votes-${post.id}">${post.upvotes || 0}</span>
      </div>
      <div class="feed-body">
        <div class="feed-meta">
          <span class="post-flair ${cat.flair}">${cat.label}</span>
          ${tags}
          <span class="feed-time">· ${timeAgo(post.published_at || post.created_at)}</span>
        </div>
        <h2 class="feed-title"><a href="post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a></h2>
        <p class="feed-excerpt">${post.excerpt || excerptFromContent(post.content)}</p>
        <div class="feed-footer">
          <div class="feed-author">
            <span class="avatar-sm">${getInitials(post.author_name)}</span>
            <span>${post.author_name}</span>
          </div>
          <a href="post.html?slug=${encodeURIComponent(post.slug)}#comments" class="feed-comments">💬 ${post.comment_count || 0} bình luận</a>
        </div>
      </div>
      ${post.cover_image ? `<div class="feed-thumb" style="background-image:url('${post.cover_image}')"></div>` : ''}
    </article>`;
}
