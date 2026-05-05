import { Home, Users, Wallet, ArrowRight, Shield, Bell, Clock } from 'lucide-react';

export default function Landing() {
  return (
    <main className="pt-16">
      {/* HERO */}
      <section id="home" className="hero min-h-[85vh] bg-base-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="hero-content text-center relative z-10 px-6">
          <div className="max-w-4xl">
            <div className="badge badge-primary badge-outline font-bold mb-6 py-3 px-4 animate-bounce">
              Digitalisasi Administrasi RT v2.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-base-content leading-[1.1] tracking-tight">
              Kelola Warga Jadi <br />
              <span className="text-primary">Lebih Mudah</span> & Transparan
            </h1>

            <p className="text-lg md:text-xl text-base-content/60 mb-10 max-w-2xl mx-auto font-medium">
              Sistem administrasi RT digital untuk mengatur data warga, iuran bulanan, 
              dan laporan warga dengan rapi dalam satu platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/login" className="btn btn-primary btn-lg rounded-2xl shadow-xl shadow-primary/20 px-8">
                Mulai Sekarang
                <ArrowRight size={20} />
              </a>
              <a href="#features" className="btn btn-ghost btn-lg rounded-2xl border border-base-300">
                Pelajari Fitur
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR UTAMA */}
      <section className="bg-base-100 relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                Fitur Unggulan Kami
              </h2>
              <p className="text-base-content/50 text-lg font-medium">
                Dirancang khusus untuk kebutuhan Ketua RT dan warga agar urusan lingkungan menjadi lebih efisien.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-base-300 mx-12 mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature
              icon={<Users size={24} />}
              title="Data Warga Digital"
              desc="Simpan semua data penghuni dan status rumah dengan aman dan mudah diakses."
              color="text-primary"
              bg="bg-primary/10"
            />
            <Feature
              icon={<Wallet size={24} />}
              title="Manajemen Iuran"
              desc="Pantau pembayaran iuran bulanan warga secara otomatis dan transparan."
              color="text-success"
              bg="bg-success/10"
            />
            <Feature
              icon={<Bell size={24} />}
              title="Laporan Warga"
              desc="Warga dapat mengirim laporan atau keluhan langsung melalui sistem kepada Ketua RT."
              color="text-warning"
              bg="bg-warning/10"
            />
            <Feature
              icon={<Shield size={24} />}
              title="Keamanan Data"
              desc="Data warga dilindungi dengan sistem enkripsi standar industri."
              color="text-error"
              bg="bg-error/10"
            />
          </div>
        </div>
      </section>

      {/* TENTANG KAMI / VISI MISI */}
      <section className="bg-base-200" id="about">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-6">
                <div className="w-8 h-px bg-primary" />
                Tentang E-RT Digital
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">
                Membangun Komunitas <br />
                Yang Lebih Cerdas
              </h2>

              <p className="text-base-content/70 text-lg leading-relaxed mb-6 font-medium">
                E-RT Digital dibuat untuk membantu Ketua RT dan warga mengatur urusan lingkungan
                menggunakan teknologi yang mudah digunakan oleh semua kalangan.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1.5 rounded-lg text-primary">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold">Efisiensi Waktu</h4>
                    <p className="text-sm text-base-content/60">Tidak perlu lagi menulis manual di buku kas yang tebal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-success/20 p-1.5 rounded-lg text-success">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold">Transparansi Dana</h4>
                    <p className="text-sm text-base-content/60">Warga dapat melihat laporan keuangan RT secara terbuka.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-50" />
                <div className="card bg-base-100 shadow-2xl rounded-[3rem] overflow-hidden border border-base-300 relative">
                  <div className="card-body p-10">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-primary/30">
                      <Home size={32} className="text-primary-content" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight">Visi Kami</h3>
                    <p className="text-base-content/70 text-lg mb-8 italic">
                      "Menjadi pionir digitalisasi administrasi lingkungan di Indonesia yang mudah, terjangkau, dan terpercaya."
                    </p>
                    
                    <div className="divider">Misi Kami</div>
                    
                    <ul className="space-y-4 mt-6">
                      {[
                        'Menyederhanakan manajemen data warga',
                        'Mengoptimalkan transparansi iuran kas RT',
                        'Menyediakan platform komunikasi yang efektif'
                      ].map((misi, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold text-base-content/80">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {misi}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface FeatureProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function Feature({ title, desc, icon, color, bg }: FeatureProps) {
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-base-200 group rounded-[2.5rem]">
      <div className="card-body p-8">
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-base-content/60 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}
