export default function Landing() {
  return (
    <main>
      {/* HERO */}
      <section id="home" className="hero min-h-[90vh] bg-base-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />

        <div className="hero-content text-center relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-base-content leading-tight">
              Ngatur Penggawean,<br className="hidden md:block" />
              Ora Ribet
            </h2>

            <p className="text-lg text-base-content/70 mb-8">
              Gawean iso mbantu tim ngatur tugas, ngawasi progres,
              lan kolaborasi luwih rapi ing siji platform.
            </p>

            <div className="flex justify-center gap-4">
              <button className="btn btn-primary btn-lg">
                Mulai Gratis
              </button>
              <button className="btn btn-outline btn-lg">
                Pelajari
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR KAMI */}
      <section className="bg-base-100" id="features">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Kami
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Dirancang supaya tim iso kerja luwih efisien, fokus,
              lan terorganisir tanpa ribet.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Feature
              title="Board Interaktif"
              desc="Kelola proyek nganggo tampilan board sing gampang dipahami."
            />
            <Feature
              title="Deadline Reminder"
              desc="Notifikasi otomatis supaya ora kelalen deadline."
            />
            <Feature
              title="Role & Akses"
              desc="Atur hak akses anggota tim sesuai peran."
            />
            <Feature
              title="Laporan Proyek"
              desc="Ringkasan progres lan performa proyek kanthi visual."
            />
          </div>
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section className="bg-base-200" id="about">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tentang Kami
              </h2>

              <p className="text-base-content/70 leading-relaxed mb-4">
                Gawean digawe kanggo mbantu UMKM, startup,
                lan tim mahasiswa supaya luwih gampang
                ngatur proyek lan kolaborasi.
              </p>

              <p className="text-base-content/70 leading-relaxed mb-8">
                Misi kita sederhana: nggawe sistem manajemen tugas
                sing simpel, cepet, lan ora mbingungake.
              </p>

              {/* SOCIAL MEDIA */}
              <div>
                <h3 className="font-semibold mb-4">Sosial Media</h3>

                <div className="flex gap-4">
                  <a
                    href="#"
                    className="btn btn-circle btn-outline hover:btn-primary transition-all"
                  >
                    {/* Instagram */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2" />
                      <circle cx="12" cy="12" r="4" strokeWidth="2" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="btn btn-circle btn-outline hover:btn-primary transition-all"
                  >
                    {/* Twitter/X */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2H21l-6.56 7.49L22 22h-6.828l-5.35-7.003L3.9 22H1.14l7.02-8.012L2 2h6.92l4.84 6.354L18.244 2z" />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="btn btn-circle btn-outline hover:btn-primary transition-all"
                  >
                    {/* LinkedIn */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.65V24h-5v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24h-5V8z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>


            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">
                  Visi
                </h3>
                <p className="text-base-content/70">
                  Dadi platform manajemen kerja sing
                  gampang digunakake lan terjangkau.
                </p>

                <div className="divider"></div>

                <h3 className="card-title">
                  Misi
                </h3>
                <ul className="list-disc list-inside text-base-content/70 space-y-2">
                  <li>Nyederhanakake manajemen proyek</li>
                  <li>Ngoptimalkan kolaborasi tim</li>
                  <li>Nyedhiyakake fitur sing relevan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-lg transition-all">
      <div className="card-body">
        <h3 className="card-title text-base-content">
          {title}
        </h3>
        <p className="text-base-content/70 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  )
}
