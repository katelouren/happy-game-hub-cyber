"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Gamepad2,
  LoaderCircle,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (mode === "register" && name.trim().length < 2) {
      setStatus("error");
      setMessage("Informe um nome com pelo menos dois caracteres.");
      return;
    }

    if (!email.includes("@") || password.length < 6) {
      setStatus("error");
      setMessage("Informe um e-mail válido e uma senha com pelo menos seis caracteres.");
      return;
    }

    setStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setPassword("");
    setStatus("success");
    setMessage(
      mode === "login"
        ? "Validação local concluída. Nenhuma conta foi autenticada e nenhuma credencial foi enviada ou armazenada."
        : "Validação local concluída. Nenhuma conta foi criada e os dados não foram enviados nem armazenados.",
    );
  }

  function switchMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
    setStatus("idle");
    setMessage("");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Área do colaborador
          </p>

          <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Entre no Happy Game Hub
          </h1>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Acesse sua experiência personalizada no Happy Game Hub e acompanhe
            sua trilha de desenvolvimento.
          </p>

          <div className="mt-8 rounded-3xl border border-lime-400/20 bg-[#020817] p-6 sm:mt-10 sm:p-8">
            <Gamepad2 aria-hidden="true" size={48} className="mb-5 text-lime-400" />
            <h2 className="mb-3 text-2xl font-bold">Perfil personalizado</h2>
            <p className="leading-relaxed text-slate-400">
              Seu perfil e preferências ajudam a personalizar sua trilha de
              desenvolvimento e segurança digital. Essas informações ficam
              somente neste navegador.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10"
        >
          <div className="mb-8 text-center">
            <UserRound aria-hidden="true" size={52} className="mx-auto mb-4 text-lime-400" />
            <h2 className="text-3xl font-extrabold">
              {mode === "login" ? "Acesso à plataforma" : "Cadastro"}
            </h2>
            <p className="mt-2 text-slate-400">
              {mode === "login"
                ? "Preencha os campos para validar o acesso local."
                : "Preencha os campos para validação local."}
            </p>
          </div>

          {mode === "register" && (
            <label htmlFor="login-name" className="mb-5 block">
              <span className="mb-2 block font-semibold text-slate-200">Nome</span>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
                <UserRound aria-hidden="true" size={20} className="text-lime-400" />
                <input
                  id="login-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  disabled={status === "loading"}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Como deseja ser chamado?"
                  className="w-full bg-transparent py-4 text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
            </label>
          )}

          <label htmlFor="login-email" className="mb-5 block">
            <span className="mb-2 block font-semibold text-slate-200">E-mail</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
              <Mail aria-hidden="true" size={20} className="text-lime-400" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                disabled={status === "loading"}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@exemplo.com"
                required
                className="w-full bg-transparent py-4 text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </label>

          <label htmlFor="login-password" className="mb-6 block">
            <span className="mb-2 block font-semibold text-slate-200">Senha</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
              <Lock aria-hidden="true" size={20} className="text-lime-400" />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                disabled={status === "loading"}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                minLength={6}
                required
                className="w-full bg-transparent py-4 text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-wait disabled:opacity-70"
          >
            {status === "loading" && (
              <LoaderCircle aria-hidden="true" className="animate-spin" size={20} />
            )}
            {status === "loading"
              ? "Validando..."
              : mode === "login"
                ? "Entrar"
                : "Criar perfil"}
          </button>

          <div
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`mt-5 min-h-12 rounded-xl p-3 text-sm ${
              status === "success"
                ? "border border-lime-400/30 bg-lime-400/10 text-lime-300"
                : status === "error"
                  ? "border border-red-400/30 bg-red-400/10 text-red-200"
                  : "text-slate-400"
            }`}
          >
            {status === "success" && (
              <CheckCircle2 aria-hidden="true" className="mr-2 inline" size={18} />
            )}
            {message}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? "Ainda não tem perfil?" : "Já possui um perfil?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              disabled={status === "loading"}
              className="rounded font-bold text-lime-400 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 disabled:cursor-wait disabled:opacity-50"
            >
              {mode === "login" ? "Criar cadastro" : "Voltar ao login"}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
