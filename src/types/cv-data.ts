export interface Education {
  Degree: string;
  StartYear: number;
  EndYear: number;
  Program: string;
  Focus: string;
  Institution: string;
  Logo: string;
  City: string;
  State: string;
  Country: string;
  Department: string;
  Supervisors: string;
  Group: string;
  Thesis: string;
  bullets: string[];
}

export interface Experience {
  Type: string;
  Select: string;
  Position: string;
  StartYear: number;
  EndYear: string | number;
  Title: string;
  Link: string;
  Institution: string;
  City: string;
  State: string;
  Country: string;
  Department: string;
  Supervisor: string;
  bullets: string[];
}

export interface Publication {
  Type: string;
  Authors: string;
  Title: string;
  Journal: string;
  Volume: string;
  Number: string;
  Pages: string;
  Year: number;
  Publisher: string;
  Link: string;
  Comments: string;
  Comments_hidden: string;
}

export interface Talk {
  Type: string;
  Title: string;
  Event: string;
  Department: string;
  Institution: string;
  Year: number;
  Contact: string;
  Link: string;
  Comments: string;
}

export interface Grant {
  Type: string;
  Status: string;
  PI: string;
  GrantID: string;
  GrantName: string;
  Source: string;
  Project: string;
  StartYear: number;
  EndYear: number | string;
  Role: string;
  Amount: string;
  Comments: string;
}

export interface Tool {
  Name: string;
  Title: string;
  Authors: string;
  GitHub: string;
  Link: string;
  PaperLink: string;
  Released: string;
  OpenSource: string;
  Language: string;
  Type: string;
  Distribution: string;
}

export interface Skill {
  Type: string;
  Group: string;
  Title: string;
  Description: string;
  LevelText: string;
  Level: number | string;
  LevelMax: number | string;
}

export interface Profile {
  Type: string;
  Icon: string;
  Text: string;
  Link: string;
  bullets: string[];
}

export interface CVData {
  education: Education[];
  experience: Experience[];
  publications: Publication[];
  talks: Talk[];
  grants: Grant[];
  tools: Tool[];
  skills: Skill[];
  profile: Profile[];
}
