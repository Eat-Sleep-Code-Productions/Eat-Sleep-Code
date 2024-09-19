interface Problems {
  completed: boolean;
  completed_at: Date;
  difficulty: "Easy" | "Medium" | "Hard";
  id: string;
  title: string;
  title_slug: string;
  topic_tags: string[];
  times_completed: number;
}

export interface Row {
  problems: Problems[];
}

export interface BoardState {
  rows: Problems[];
}

export interface RowProps {
  row: Problems;
}

export interface BoardRowPopup {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface LeetcodeProblem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic_tags: string[];
  id: string;
  title_slug: string;
}

export interface AddLeetcodeProblem {
  problem_id: string;
}
