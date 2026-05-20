"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { InputMask } from "@react-input/mask";

const UA_MASK = "+380 (__) ___ __ __";
const INT_MASK = "+_ ___ ___ __ __";

const schema = z.object({
  parentName: z.string().min(1),
  phone: z.string().refine((v) => (v ?? "").replace(/\D/g, "").length >= 7),
  city: z.string().min(1),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
  className?: string;
  source?: string;
};

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-content placeholder-zinc-400 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 dark:placeholder-zinc-500";

type ErrorKind = "generic" | "rate_limited";

export function EnrollForm({ onSuccess, className, source = "sila-slova" }: Props) {
  const t = useTranslations("enroll_form");
  const [submitted, setSubmitted] = useState(false);
  const [abroad, setAbroad] = useState(false);
  const [error, setError] = useState<ErrorKind | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function toggleAbroad(checked: boolean) {
    setAbroad(checked);
    setValue("phone", "", { shouldValidate: false });
  }

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.parentName,
          phone: data.phone,
          city: data.city,
          message: data.comment ?? "",
          source,
        }),
      });
      if (!res.ok) {
        setError(res.status === 429 ? "rate_limited" : "generic");
        return;
      }
      setSubmitted(true);
      if (onSuccess) setTimeout(onSuccess, 2500);
    } catch {
      setError("generic");
    }
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mb-3 text-5xl">🎉</div>
        <h3 className="mb-2 text-xl font-bold text-content">
          {t("success_title")}
        </h3>
        <p className="text-sm text-content-muted">{t("success_body")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-3">
        {/* Parent name */}
        <div>
          <label className="sr-only">{t("parent_name_label")}</label>
          <input
            type="text"
            placeholder={t("parent_name_placeholder")}
            {...register("parentName")}
            required
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 flex cursor-pointer items-center justify-end gap-1.5 text-xs text-content-muted">
            <input
              type="checkbox"
              checked={abroad}
              onChange={(e) => toggleAbroad(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-accent-500"
            />
            {t("phone_abroad_label")}
          </label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <InputMask
                {...field}
                mask={abroad ? INT_MASK : UA_MASK}
                replacement={{ _: /\d/ }}
                placeholder={abroad ? INT_MASK : UA_MASK}
                required
                aria-label={t("phone_label")}
                className={inputClass}
              />
            )}
          />
        </div>

        {/* City */}
        <div>
          <label className="sr-only">{t("city_label")}</label>
          <input
            type="text"
            placeholder={t("city_placeholder")}
            {...register("city")}
            required
            className={inputClass}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="sr-only">{t("comment_label")}</label>
          <textarea
            rows={2}
            placeholder={t("comment_placeholder")}
            {...register("comment")}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            <p className="font-semibold">{t("error_title")}</p>
            <p className="mt-1">
              {t(error === "rate_limited" ? "error_rate_limited" : "error_body")}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:from-accent-400 hover:to-accent-500 hover:shadow-orange-500/40 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          {isSubmitting ? "..." : t("submit")}
        </button>

        <p className="text-center text-xs leading-relaxed text-content-subtle">
          {t("privacy")}
        </p>
      </div>
    </form>
  );
}
