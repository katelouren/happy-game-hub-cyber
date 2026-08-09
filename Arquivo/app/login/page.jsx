import { Lock, Mail, UserRound, Gamepad2 } from "lucide-react";

export default function Login() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-8 py-12 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-10">
          <p className="mb-4 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Área do usuário
          </p>

          <h1 className="mb-6 text-5xl font-extrabold">
            Entre no Happy Game Hub
          </h1>

          <p className="text-lg leading-relaxed text-slate-300">
            Acesse seu perfil para salvar preferências, acompanhar recomendações
            e receber sugestões personalizadas de jogos.
          </p>

          <div className="mt-10 rounded-3xl border border-lime-400/20 bg-[#020817] p-8">
            <Gamepad2 size={52} className="mb-5 text-lime-400" />
            <h2 className="mb-3 text-2xl font-bold">Perfil personalizado</h2>
            <p className="text-slate-400">
          Futuramente, o sistema de login permitirá o armazenamento do histórico de recomendações, preferências do usuário e integração com recursos de Inteligência Artificial, controle parental e mecanismos de segurança digital.
            </p>
          </div>
        </div>

        <form className="rounded-3xl border border-slate-800 bg-[#061225] p-10">
          <div className="mb-8 text-center">
            <UserRound size={52} className="mx-auto mb-4 text-lime-400" />
            <h2 className="text-3xl font-extrabold">Login</h2>
            <p className="mt-2 text-slate-400">
              Acesse sua conta para continuar.
            </p>
          </div>

          <label className="mb-5 block">
            <span className="mb-2 block font-semibold text-slate-200">
              E-mail
            </span>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4">
              <Mail size={20} className="text-lime-400" />
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                className="w-full bg-transparent py-4 text-slate-300 outline-none"
              />
            </div>
          </label>

          <label className="mb-6 block">
            <span className="mb-2 block font-semibold text-slate-200">
              Senha
            </span>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4">
              <Lock size={20} className="text-lime-400" />
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full bg-transparent py-4 text-slate-300 outline-none"
              />
            </div>
          </label>

          <button
            type="button"
            className="w-full rounded-xl bg-lime-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-lime-300"
          >
            Entrar
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Ainda não tem conta?{" "}
            <span className="font-bold text-lime-400">
              Criar cadastro
            </span>
          </p>
        </form>
      </section>
    </main>
  );
}