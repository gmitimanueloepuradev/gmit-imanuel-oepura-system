export default function OurLocation() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Kunjungi Kami
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Bergabunglah dengan keluarga besar GMIT Imanuel Oepura
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Map */}
            <div className="lg:col-span-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981.7226481810433!2d123.60636807103121!3d-10.189539637452759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c569b4f7ad821c9%3A0x994b9e248ff1384a!2sCPCT%20Imanuel%20Oepura%20Parish!5e0!3m2!1sen!2sid!4v1755077287280!5m2!1sen!2sid"
                width="600"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-64 lg:h-80"
              ></iframe>
            </div>

            {/* Address Info */}
            <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-600 dark:to-gray-500">
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Alamat Gereja</h3>
                <p className="text-gray-600 dark:text-gray-200 leading-relaxed">
                  RJ64+5Q6, Oepura<br/>
                  Kec. Maulafa<br/>
                  Kota Kupang, NTT 85142<br/>
                  <span className="font-medium">Jl. H. R. Koroh</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
