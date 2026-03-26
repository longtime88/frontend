export default function Anmelden() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Anmelden</h1>

      <form className="w-full max-w-sm bg-white text-black p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block mb-1 font-medium">E-Mail</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deine E-Mail"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Passwort</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dein Passwort"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Einloggen
        </button>
      </form>
    </div>
  )
}
