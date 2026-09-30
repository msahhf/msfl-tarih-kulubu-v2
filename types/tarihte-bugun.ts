export interface TarihEvent {
  year: number | string;
  title: string;
  description: string;
}

export interface TarihGeneration {
  events: TarihEvent[];
  originalAIContent: string;
  generatedBy: string;
  generatedAt: Date;
}

export interface TarihteBugunEntry {
  _id?: unknown;
  dateKey: string; // format "MM-DD" e.g. "09-29"
  events: TarihEvent[];
  originalAIContent: string;
  generatedBy: string;
  generatedAt: Date;
  editedByAdmin?: boolean;
  editedAt?: Date;
  /** Previous AI generations, oldest last. Never deleted by updates. */
  history?: TarihGeneration[];
  createdAt: Date;
  updatedAt: Date;
}
