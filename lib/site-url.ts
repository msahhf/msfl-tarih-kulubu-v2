/**
 * Tek kanonik site adresi.
 *
 * Site birden fazla platformda (Vercel, Netlify, özel alan adı) yayınlanabildiği
 * için adres kod içine gömülmez; `NEXT_PUBLIC_SITE_URL` üzerinden verilir.
 * Değer yoksa eski Vercel alan adına düşer.
 */
const fallback = "https://msfltarihkulubu.vercel.app";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallback).replace(
  /\/+$/,
  ""
);
