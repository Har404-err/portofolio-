# Domain Context

## KyioAPI Gateway

**KyioAPI Gateway** adalah platform akses terpadu yang menyediakan kemampuan digital melalui satu pintu bagi developer dan bot otomasi. Gateway menjadi titik temu untuk permintaan ke beberapa kategori kemampuan, termasuk AI, multimedia, scraping, dan automation.

**Capability** adalah kemampuan yang dapat diminta melalui KyioAPI Gateway, seperti percakapan AI, pemrosesan multimedia, scraping, atau automation. Capability menjelaskan apa yang dapat dilakukan pengguna, bukan bagaimana kemampuan itu diwujudkan.

**Endpoint** adalah titik akses yang mewakili satu capability atau operasi tertentu di dalam KyioAPI Gateway.

**AI Model** adalah persona atau kemampuan pemrosesan bahasa yang dipilih untuk memenuhi permintaan AI. Dalam konteks showcase saat ini, **GPT-5.6 Terra AI** adalah AI Model yang berfokus pada coding dan logic.

**Gateway Routing** adalah keputusan internal untuk meneruskan permintaan ke capability atau AI Model yang sesuai. Istilah ini dipakai untuk KyioAPI Gateway dan tidak disamakan dengan mekanisme pemilihan sumber audio pada Music Player.

**Provider Fallback** adalah perpindahan ke penyedia atau jalur pemenuhan alternatif ketika jalur utama tidak dapat memenuhi permintaan. Dalam domain KyioAPI Gateway, istilah ini lebih tepat daripada “Multi-Engine” karena menekankan ketahanan pemenuhan capability.

**Integrasi** adalah penggunaan capability KyioAPI Gateway oleh aplikasi, developer, atau bot otomasi. Integrasi berfokus pada hubungan pengguna dengan gateway, bukan pada implementasi internal gateway.

## Batas Domain

KyioAPI Gateway berfokus pada penyediaan capability digital melalui gateway dan integrasi oleh consumer. Music Player adalah domain terpisah yang menggunakan resolver audio untuk menemukan dan memutar track; istilah “audio resolver chain” digunakan di domain tersebut, bukan “Provider Fallback” dari KyioAPI Gateway.

## Istilah yang Dihindari

- **Multi-Engine** — hindari sebagai istilah kanonik KyioAPI Gateway karena terlalu luas dan mudah tertukar dengan mekanisme resolver audio Music Player.
- **API key** — bukan konsep domain publik KyioAPI Gateway dalam showcase saat ini; jangan menggunakannya untuk menjelaskan hubungan consumer dengan gateway.
