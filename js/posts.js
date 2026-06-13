const POST_CATEGORIES = {
  guide: { label: 'Hướng dẫn', flair: 'flair-guide' },
  review: { label: 'Đánh giá', flair: 'flair-review' },
  experience: { label: 'Trải nghiệm', flair: 'flair-experience' },
  news: { label: 'Tin tức', flair: 'flair-news' },
  discussion: { label: 'Bài viết', flair: 'flair-guide' },
  blog: { label: 'Blog', flair: 'flair-experience' },
};

const DEMO_POSTS_KEY = 'vv_demo_posts';
const DEMO_COMMENTS_KEY = 'vv_demo_comments';
const SAMPLE_SEEDED_KEY = 'vv_sample_seeded';

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdown(text) {
  if (!text) return '';
  if (typeof marked !== 'undefined') {
    marked.setOptions({ breaks: true, gfm: true });
    return marked.parse(text);
  }
  return escapeHtml(text).replace(/\n/g, '<br>');
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

function getDemoComments() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_COMMENTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function getDemoCommentsForPost(postId) {
  return getDemoComments()[postId] || [];
}

function saveDemoComment(postId, comment) {
  const all = getDemoComments();
  if (!all[postId]) all[postId] = [];
  all[postId].push(comment);
  localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(all));
}

function seedSamplePostsIfNeeded() {
  if (localStorage.getItem(SAMPLE_SEEDED_KEY)) return;
  const existing = getDemoPosts();
  if (existing.length) {
    localStorage.setItem(SAMPLE_SEEDED_KEY, '1');
    return;
  }
  if (typeof SAMPLE_POSTS === 'undefined') return;
  const posts = SAMPLE_POSTS.map((p) => ({
    ...p,
    excerpt: p.excerpt || excerptFromContent(p.content),
  }));
  saveDemoPosts(posts);
  localStorage.setItem(SAMPLE_SEEDED_KEY, '1');
}

async function fetchPublishedPosts({ category, limit = 50, order = 'published_at.desc' } = {}) {
  seedSamplePostsIfNeeded();
  try {
    let query = `posts?status=eq.published&select=*&order=${order}&limit=${limit}`;
    if (category && category !== 'all') query += `&category=eq.${category}`;
    const rows = await supabaseRest(query);
    if (rows?.length) return rows;
    return getDemoPosts().filter((p) => p.status === 'published');
  } catch {
    return getDemoPosts().filter((p) => p.status === 'published');
  }
}

async function fetchPostBySlug(slug) {
  seedSamplePostsIfNeeded();
  try {
    const rows = await supabaseRest(`posts?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
    if (rows?.[0]) return rows[0];
    return getDemoPosts().find((p) => p.slug === slug && p.status === 'published') || null;
  } catch {
    return getDemoPosts().find((p) => p.slug === slug && p.status === 'published') || null;
  }
}

async function fetchMyPosts(authorId) {
  seedSamplePostsIfNeeded();
  try {
    return await authRest(`posts?author_id=eq.${authorId}&select=*&order=updated_at.desc`);
  } catch {
    return getDemoPosts().filter((p) => p.author_id === String(authorId));
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
    const demo = {
      ...post,
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes: 0,
      comment_count: 0,
      excerpt: post.excerpt || excerptFromContent(post.content),
    };
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

function buildCommentTree(comments) {
  const map = {};
  const roots = [];
  comments.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });
  comments.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}

async function fetchComments(postId) {
  try {
    const rows = await supabaseRest(
      `comments?post_id=eq.${postId}&select=*&order=created_at.asc`
    );
    if (rows?.length) return rows;
    return getDemoCommentsForPost(postId);
  } catch {
    return getDemoCommentsForPost(postId);
  }
}

async function fetchAllCommentsAdmin() {
  try {
    return await authRest(
      'comments?select=*,posts(title,slug)&order=created_at.desc&limit=100'
    );
  } catch {
    const posts = getDemoPosts();
    const all = getDemoComments();
    const flat = [];
    Object.keys(all).forEach((postId) => {
      const post = posts.find((p) => p.id === postId);
      all[postId].forEach((c) => {
        flat.push({
          ...c,
          posts: post ? { title: post.title, slug: post.slug } : null,
        });
      });
    });
    return flat.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

async function addComment(postId, { author_name, content, parent_id = null }) {
  const comment = {
    post_id: postId,
    author_name,
    content,
    parent_id,
    upvotes: 0,
    created_at: new Date().toISOString(),
  };
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
    if (p) {
      p.comment_count = (p.comment_count || 0) + 1;
      saveDemoPosts(posts);
    }
    return demo;
  }
}

async function deleteComment(id, postId) {
  try {
    await authRest(`comments?id=eq.${id}`, { method: 'DELETE' });
  } catch {
    const all = getDemoComments();
    if (all[postId]) {
      all[postId] = all[postId].filter((c) => c.id !== id && c.parent_id !== id);
      localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(all));
      const posts = getDemoPosts();
      const p = posts.find((x) => x.id === postId);
      if (p && p.comment_count > 0) {
        p.comment_count -= 1;
        saveDemoPosts(posts);
      }
    }
  }
}

function blogFeaturedHtml(post) {
  const cat = POST_CATEGORIES[post.category] || POST_CATEGORIES.guide;
  return `
    <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-featured reveal">
      <div class="blog-featured-bg" style="background-image:url('${post.cover_image || 'assets/onsen.jpg'}')"></div>
      <div class="blog-featured-overlay"></div>
      <div class="blog-featured-content">
        <span class="post-flair ${cat.flair}">${cat.label}</span>
        <h2 class="blog-featured-title">${escapeHtml(post.title)}</h2>
        <p class="blog-featured-excerpt">${escapeHtml(post.excerpt || excerptFromContent(post.content))}</p>
        <div class="blog-featured-meta">
          <span>${formatDate(post.published_at || post.created_at)}</span>
          <span class="blog-read-more">Đọc bài viết →</span>
        </div>
      </div>
    </a>`;
}

function blogCardHtml(post, index) {
  const cat = POST_CATEGORIES[post.category] || POST_CATEGORIES.guide;
  const delay = Math.min(index * 0.08, 0.48);
  return `
    <article class="blog-card reveal" style="--reveal-delay:${delay}s" data-slug="${post.slug}">
      <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card-link">
        <div class="blog-card-visual">
          <div class="blog-card-img" style="background-image:url('${post.cover_image || 'assets/onsen.jpg'}')"></div>
          <div class="blog-card-shine"></div>
          <span class="post-flair ${cat.flair}">${cat.label}</span>
        </div>
        <div class="blog-card-body">
          <time class="blog-card-date">${formatDate(post.published_at || post.created_at)}</time>
          <h2 class="blog-card-title">${escapeHtml(post.title)}</h2>
          <p class="blog-card-excerpt">${escapeHtml(post.excerpt || excerptFromContent(post.content, 120))}</p>
          <div class="blog-card-footer">
            <span class="blog-card-author">${escapeHtml(post.author_name)}</span>
            <span class="blog-card-comments">${post.comment_count || 0} bình luận</span>
          </div>
        </div>
      </a>
    </article>`;
}

function commentItemHtml(c, postId, depth = 0) {
  const replies = (c.replies || [])
    .map((r) => commentItemHtml(r, postId, depth + 1))
    .join('');
  return `
    <div class="comment-thread-item" data-id="${c.id}" style="--depth:${depth}">
      <div class="comment-bubble">
        <div class="comment-meta">
          <span class="avatar-sm">${getInitials(c.author_name)}</span>
          <strong>${escapeHtml(c.author_name)}</strong>
          <span>· ${timeAgo(c.created_at)}</span>
        </div>
        <div class="comment-body">${escapeHtml(c.content).replace(/\n/g, '<br>')}</div>
        <button type="button" class="comment-reply-btn" data-parent="${c.id}">Trả lời</button>
      </div>
      ${replies ? `<div class="comment-replies">${replies}</div>` : ''}
    </div>`;
}

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
