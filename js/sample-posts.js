const SAMPLE_POSTS = [
  {
    id: 'sample-onsen',
    slug: 'japanese-onsen-vuon-vua-khoang-nong-40-do',
    title: 'Japanese Onsen tại Vườn Vua — Trải Nghiệm Khoáng Nóng 40°C Giữa Thiên Nhiên',
    category: 'guide',
    tags: ['onsen', 'wellness', 'gia đình'],
    cover_image: 'assets/onsen.jpg',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Khám phá Japanese Onsen tại King Garden Onsen, Vườn Vua — khoáng nóng 40°C, không gian zen và wellness trọn vẹn cho cả gia đình.',
    content: `## Tại sao nên thử Onsen tại Vườn Vua?

Đắm mình trong dòng **khoáng nóng 40°C**, không gian xanh mát và trải nghiệm wellness trọn vẹn — Japanese Onsen tại King Garden Onsen là điểm nhấn không thể bỏ qua khi nghỉ dưỡng tại Vườn Vua.

## Trải nghiệm thực tế

- Bể khoáng nóng ngoài trời view thiên nhiên
- Khu vực thư giãn zen sau tắm
- Phù hợp cả gia đình và cặp đôi

> "Buổi sáng sớm ngâm mình trong làn khói mỏng, nghe tiếng nước chảy — đó là khoảnh khắc tôi nhớ nhất ở Vườn Vua."

## Mẹo khi đến Onsen

1. Đặt lịch trước vào cuối tuần
2. Mang theo đồ bơi thoải mái
3. Kết hợp với spa hoặc hồ bơi trong cùng ngày

[Đặt phòng ngay](booking.html?service=onsen) để trải nghiệm Onsen trong kỳ nghỉ của bạn.`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-01T08:00:00.000Z',
    created_at: '2026-06-01T08:00:00.000Z',
    updated_at: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'sample-pool',
    slug: 'ho-boi-vuon-vua-boi-loi-check-in-canh-quan',
    title: 'Hồ Bơi Vườn Vua — Bơi Lội & Check-in Cảnh Quan Xanh Mát',
    category: 'experience',
    tags: ['hồ bơi', 'chill', 'check-in'],
    cover_image: 'assets/pool.png',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Hồ bơi trung tâm resort Vườn Vua — bơi lội thư thái, view thiên nhiên và khoảnh khắc hoàng hôn đáng nhớ.',
    content: `## Không gian bơi lội giữa thiên nhiên

Hồ bơi tại trung tâm resort mang đến trải nghiệm **bơi lội thư thái**, check-in cảnh quan xanh mát và tận hưởng hoàng hôn giữa không gian resort.

## Điểm nổi bật

- View thiên nhiên xanh mát
- Khu vực chill & photo spot
- Mở cửa cả ngày cho khách lưu trú

## Ai nên ghé?

Gia đình có trẻ nhỏ, nhóm bạn muốn giải nhiệt buổi chiều, hoặc cặp đôi tìm góc hoàng hôn lãng mạn.

[Đặt dịch vụ hồ bơi](booking.html?service=pool) cùng kỳ nghỉ của bạn.`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-02T08:00:00.000Z',
    created_at: '2026-06-02T08:00:00.000Z',
    updated_at: '2026-06-02T08:00:00.000Z',
  },
  {
    id: 'sample-tennis',
    slug: 'san-tennis-tieu-chuan-quoc-te-vuon-vua',
    title: 'Sân Tennis Tiêu Chuẩn Quốc Tế — Luyện Tập & Thi Đấu Tại Resort',
    category: 'guide',
    tags: ['tennis', 'thể thao', 'luyện tập'],
    cover_image: 'assets/tennis.jpg',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Sân tennis chuyên nghiệp tại Vườn Vua — tiêu chuẩn quốc tế, phù hợp luyện tập và thi đấu cuối tuần.',
    content: `## Sân tennis chuyên nghiệp

Trải nghiệm sân tennis **tiêu chuẩn quốc tế**, phù hợp cho luyện tập buổi sáng và thi đấu giao hữu cuối tuần.

## Thông tin nhanh

| Tiêu chí | Chi tiết |
|----------|----------|
| Mặt sân | Tiêu chuẩn quốc tế |
| Phù hợp | Luyện tập · Thi đấu |
| Thời gian | Cả ngày |

Kết hợp tennis với onsen hoặc nhà hàng để có một ngày nghỉ dưỡng năng động trọn vẹn.`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-03T08:00:00.000Z',
    created_at: '2026-06-03T08:00:00.000Z',
    updated_at: '2026-06-03T08:00:00.000Z',
  },
  {
    id: 'sample-pickleball',
    slug: 'san-pickleball-mon-the-thao-xu-huong-vuon-vua',
    title: 'Sân Pickleball — Môn Thể Thao Xu Hướng Cho Cả Gia Đình',
    category: 'experience',
    tags: ['pickleball', 'gia đình', 'thể thao'],
    cover_image: 'assets/pickleball.jpg',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Pickleball tại Vườn Vua — môn thể thao xu hướng, dễ chơi, phù hợp mọi lứa tuổi trong kỳ nghỉ resort.',
    content: `## Pickleball — xu hướng mới tại resort

Sân Pickleball tại Vườn Vua là lựa chọn lý tưởng cho nhóm bạn và gia đình muốn vận động nhẹ nhàng nhưng vẫn sôi động.

## Vì sao Pickleball hot?

- Dễ học, dễ chơi cho mọi lứa tuổi
- Không gian thoáng, phù hợp chụp ảnh
- Kết hợp tốt với BBQ hoặc karaoke buổi tối

Đặt sân qua [form đặt phòng](booking.html?service=courts) và nhắn thêm "Pickleball" trong ghi chú.`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-04T08:00:00.000Z',
    created_at: '2026-06-04T08:00:00.000Z',
    updated_at: '2026-06-04T08:00:00.000Z',
  },
  {
    id: 'sample-basketball',
    slug: 'san-bong-ro-khong-gian-van-dong-soi-dong',
    title: 'Sân Bóng Rổ — Không Gian Vận Động Sôi Động Cuối Tuần',
    category: 'experience',
    tags: ['bóng rổ', 'team play', 'cuối tuần'],
    cover_image: 'assets/basketball.jpg',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Sân bóng rổ tại Vườn Vua — không gian vận động sôi động, lý tưởng cho nhóm bạn và team building.',
    content: `## Bóng rổ giữa không gian resort

Sân bóng rổ mang đến không khí **team play** sôi động — hoàn hảo cho nhóm bạn tranh tài buổi chiều trước khi thưởng thức buffet tối.

## Gợi ý lịch trình

- 15:00 — Check-in phòng
- 16:30 — Trận bóng rổ giao hữu
- 19:00 — Nhà hàng buffet

[Đặt phòng](booking.html?service=courts) cho nhóm từ 6 người trở lên.`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-05T08:00:00.000Z',
    created_at: '2026-06-05T08:00:00.000Z',
    updated_at: '2026-06-05T08:00:00.000Z',
  },
  {
    id: 'sample-restaurant',
    slug: 'nha-hang-vuon-vua-am-thuc-a-au',
    title: 'Nhà Hàng Vườn Vua — Ẩm Thực Á-Âu Trong Không Gian Sang Trọng',
    category: 'review',
    tags: ['ẩm thực', 'buffet', 'nhà hàng'],
    cover_image: 'assets/restaurant.jpg',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Review nhà hàng Vườn Vua — thực đơn Á-Âu đa dạng, buffet & à la carte, không gian sang trọng view đẹp.',
    content: `## Thực đơn đa dạng Á-Âu

Nhà hàng Vườn Vua gây ấn tượng với **buffet phong phú** và menu à la carte tinh tế — không gian sang trọng, góc view đẹp cho gia đình và hội nhóm.

## Đánh giá nhanh

- **Không gian:** 9/10 — ánh sáng ấm, bàn lớn cho nhóm
- **Món ăn:** 8.5/10 — đa dạng, tươi
- **Dịch vụ:** 9/10 — nhân viên chu đáo

> Buổi tối sau onsen, ngồi nhâm nhi món nướng và rượu vang — trải nghiệm ẩm thực đáng nhớ nhất chuyến đi.

[Đặt bàn qua booking](booking.html?service=restaurant).`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-06T08:00:00.000Z',
    created_at: '2026-06-06T08:00:00.000Z',
    updated_at: '2026-06-06T08:00:00.000Z',
  },
  {
    id: 'sample-karaoke',
    slug: 'karaoke-rieng-tu-giai-tri-dem-vuon-vua',
    title: 'Karaoke Riêng Tư — Giải Trí Đêm Cùng Bạn Bè Tại Vườn Vua',
    category: 'experience',
    tags: ['karaoke', 'giải trí', 'party'],
    cover_image: 'assets/karaoke.jpg',
    author_id: 'demo-admin',
    author_name: 'Vườn Vua',
    status: 'published',
    meta_description: 'Phòng karaoke riêng tư Vườn Vua — âm thanh chất lượng, không gian party cho nhóm bạn và gia đình.',
    content: `## Karaoke — kết thúc ngày nghỉ hoàn hảo

Sau bữa tối, đừng bỏ lỡ phòng **karaoke riêng tư** với âm thanh chất lượng và không gian thoải mái cho nhóm bạn quẩy hết mình.

## Phù hợp cho

- Tiệc sinh nhật nhỏ
- Team building cuối tuần
- Gia đình có teen thích ca hát

Kết hợp với [đặt phòng](booking.html?service=karaoke) để được ưu tiên phòng đẹp nhất.`,
    upvotes: 0,
    comment_count: 0,
    published_at: '2026-06-07T08:00:00.000Z',
    created_at: '2026-06-07T08:00:00.000Z',
    updated_at: '2026-06-07T08:00:00.000Z',
  },
];
