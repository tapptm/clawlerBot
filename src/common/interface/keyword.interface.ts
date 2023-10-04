export interface KeywordsResponse {
  keyword: string;
  count: number;
}

export interface ProjectKeyword {
  _project: number | string;
  keyword: string;
  count: number;
}

export interface ProjectResponse {
  _project: number | string;
  keyword: number;
  count: number;
}
