export interface JobOffer {
  title: string;
  company: string;
  currency: string;
  tech_stack: string;
  working_mode: string;
  created_datetime: string;
  salary: string;
  id: string;
  salary_period: string;
  location: string;
  url: string;
  updated_datetime: string;
}

export interface JobResponse {
  items: JobOffer[];
  total_items: number;
  page: number;
  page_size: number;
  total_pages: number;
}
