import type { ObjectId } from "mongodb";

/**
 * Sayfadaki işaretli alan. Değerler 0–1 arasında normalize edilir; böylece
 * sayfa hangi genişlikte çizilirse çizilsin iğne aynı noktada kalır.
 */
export type MagazineNoteAnchor = {
  x: number;
  y: number;
};

/**
 * Veritabanındaki okuyucu notu.
 *
 * `email` yalnızca kötüye kullanımı önlemek için saklanır ve hiçbir zaman
 * istemciye gönderilmez; dışa açılan tip `PublicMagazineNote`'tur.
 */
export type MagazineNote = {
  _id: ObjectId | string;
  issueSlug: string;
  /** 1 tabanlı sayfa numarası. */
  page: number;
  /** Sayfada işaretlenen nokta; `null` ise not sayfanın tamamına aittir. */
  anchor: MagazineNoteAnchor | null;
  body: string;
  /** Okuyucunun girdiği isim; boşsa not "Anonim" gösterilir. */
  name: string | null;
  email: string;
  createdAt: Date;
};

/** İstemciye gönderilen güvenli görünüm — e-posta içermez. */
export type PublicMagazineNote = {
  id: string;
  page: number;
  anchor: MagazineNoteAnchor | null;
  body: string;
  name: string | null;
  createdAt: string;
};

export type CreateMagazineNoteInput = {
  issueSlug: string;
  page: number;
  anchor: MagazineNoteAnchor | null;
  body: string;
  name: string | null;
  email: string;
};
