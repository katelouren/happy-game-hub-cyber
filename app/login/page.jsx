"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  CircleAlert,
  LoaderCircle,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";

import { evaluateLoginPassword, validateLoginFields } from "@/lib/loginSecurity.mjs";

const STRENGTH_COLORS = ["bg-slate-700", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-lime-400", "bg-emerald-400"];

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const passwordStrength = evaluateLoginPassword(password);

  function updateField(field, setter, value) {
    setter(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (status === "loading") return;
    const nextErrors = validateLoginFields({ name, email, password, mode });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("error");
      document.getElementById(`login-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    setStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setPassword("");
    setShowPassword(false);
    setErrors({});
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
    setShowPassword(false);
    setErrors({});
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-[#061225] p-6 sm:p-10">
          <p className="mb-4 inline-block rounded-md border border-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            Área do colaborador
          </p>

          <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Entre no Happy Game Hub
          </h1>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Pratique cuidados com suas credenciais e prepare uma rotina digital
            mais segura. A validação acontece somente neste navegador.
          </p>

          <div className="mt-8 rounded-3xl border border-lime-400/20 bg-[#020817] p-6 sm:mt-10 sm:p-8">
            <ShieldCheck aria-hidden="true" size={40} className="mb-5 text-lime-400" />
            <h2 className="mb-4 text-2xl font-bold">Proteções aplicadas nesta página</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
              {[
                "Verificação de 12 caracteres, maiúscula, minúscula, número e símbolo.",
                "Bloqueio de senhas comuns, sequências e repetições reconhecidas pelas regras locais.",
                "Força estimada e checklist calculados enquanto você digita.",
                "Validação do formato de e-mail e bloqueio de dados que não atendem aos requisitos.",
                "Mostrar ou ocultar senha e mensagens de erro associadas aos campos.",
              ].map((protection) => (
                <li key={protection} className="flex gap-3">
                  <CheckCircle2 aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-lime-400" />
                  {protection}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Validações executadas no navegador. Não criam autenticação real, não verificam vazamentos e não garantem segurança da senha.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-700 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-200">Boas práticas recomendadas</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
              <li>Não reutilize nem compartilhe senhas.</li>
              <li>Desconfie de páginas de login recebidas por links.</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
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
              <span className="mb-2 block font-semibold text-slate-200">Nome (obrigatório)</span>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
                <UserRound aria-hidden="true" size={20} className="text-lime-400" />
                <input
                  id="login-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  disabled={status === "loading"}
                  onChange={(event) => updateField("name", setName, event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  placeholder="Como deseja ser chamado?"
                  className="min-w-0 w-full bg-transparent py-4 text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
              {errors.name && <span id="name-error" role="alert" className="mt-2 block text-sm text-red-300">{errors.name}</span>}
            </label>
          )}

          <label htmlFor="login-email" className="mb-5 block">
            <span className="mb-2 block font-semibold text-slate-200">E-mail (obrigatório)</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
              <Mail aria-hidden="true" size={20} className="text-lime-400" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                disabled={status === "loading"}
                onChange={(event) => updateField("email", setEmail, event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="seuemail@exemplo.com"
                required
                className="min-w-0 w-full bg-transparent py-4 text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
            {errors.email && <span id="email-error" role="alert" className="mt-2 block text-sm text-red-300">{errors.email}</span>}
          </label>

          <div className="mb-6">
            <label htmlFor="login-password" className="mb-2 block font-semibold text-slate-200">Senha (obrigatória)</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#020817] px-4 transition focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/20">
              <Lock aria-hidden="true" size={20} className="text-lime-400" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                disabled={status === "loading"}
                onChange={(event) => updateField("password", setPassword, event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby="password-help password-feedback password-error password-criteria"
                placeholder="Mínimo de 12 caracteres"
                minLength={12}
                required
                className="min-w-0 w-full bg-transparent py-4 text-slate-200 outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                disabled={status === "loading"}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-controls="login-password"
                aria-pressed={showPassword}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lime-400 hover:bg-lime-400/10 focus-visible:outline-2 focus-visible:outline-lime-400"
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            <p id="password-error" role="alert" className="mt-2 text-sm text-red-300">{errors.password}</p>
            <div className="mt-4 rounded-xl border border-slate-700 bg-[#020817] p-4">
              <p className="mb-2 flex justify-between gap-2 text-sm font-semibold">
                <span className="text-slate-300">Força estimada</span>
                <span aria-live="polite">{passwordStrength.level}</span>
              </p>
              <div role="meter" aria-label="Força estimada da senha" aria-valuemin={0} aria-valuemax={5} aria-valuenow={passwordStrength.strength} aria-valuetext={passwordStrength.level} className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full transition-all ${STRENGTH_COLORS[passwordStrength.strength]}`} style={{ width: `${passwordStrength.strength * 20}%` }} />
              </div>
              <p id="password-feedback" className="mt-3 text-sm leading-relaxed text-slate-300">{passwordStrength.feedback}</p>
              <ul id="password-criteria" aria-label="Critérios mínimos da senha" className="mt-4 space-y-2">
                {passwordStrength.criteria.map((criterion) => (
                  <li key={criterion.id} className={`flex gap-2 text-xs leading-relaxed ${criterion.valid ? "text-lime-300" : "text-slate-400"}`}>
                    {criterion.valid ? <CheckCircle2 size={16} aria-hidden="true" className="shrink-0" /> : <CircleAlert size={16} aria-hidden="true" className="shrink-0" />}
                    <span><span className="sr-only">{criterion.valid ? "Atendido: " : "Pendente: "}</span>{criterion.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p id="password-help" className="mt-3 text-xs leading-relaxed text-slate-400">Uma senha forte deve ser longa, única e difícil de prever. Avaliação local simplificada, sem consulta a vazamentos.</p>
          </div>

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
                ? "Validar acesso local"
                : "Validar dados localmente"}
          </button>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-400"><Lock aria-hidden="true" size={16} className="shrink-0 text-lime-400" />Credenciais não são enviadas nem armazenadas nesta versão local. Nenhuma conta ou sessão autenticada é criada.</p>

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
