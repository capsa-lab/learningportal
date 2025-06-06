import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Notebook and plant sign in page image."
            src="/signInImage.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <div className="flex items-center mt-6">
              <img
                src="/logo512.png"
                className="h-10 sm:h-12 mr-4"
                alt="Logo"
              />
              <h2 className="text-2xl font-bold text-black sm:text-3xl md:text-4xl">
                Welcome Agents To The CL Training Hub
              </h2>
            </div>

            <p className="mt-4 leading-relaxed text-black/90">
              A wealth of resources designed to enhance your sales skills,
              product knowledge, and drive business success.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <div className="flex items-center mt-12">
                <img
                  src="/logo512.png"
                  className="h-10 sm:h-12 mr-4"
                  alt="Logo"
                />
                <h2 className="text-2xl font-bold text-black sm:text-3xl md:text-4xl">
                  Welcome To The CL Training Hub
                </h2>
              </div>

              <p className="mt-4 leading-relaxed text-black/90">
                A wealth of resources designed to enhance your sales skills,
                master company products, and drive business success.
              </p>
            </div>

            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
