export type DisciplineId = "technology" | "automation" | "creative";

export type Service = { name: string; description: string };

export type Discipline = {
  id: DisciplineId;
  name: string;
  /** The sculpture that stages this discipline in the 3D layer. */
  object: "loop" | "twist" | "knot";
  lede: string;
  services: Service[];
  /** Slugs from content/projects.ts that show this discipline at work. */
  projects: string[];
};

export const disciplines: Discipline[] = [
  {
    id: "technology",
    name: "Technology",
    object: "knot",
    lede: "Websites, applications, and the software a business actually runs on.",
    services: [
      {
        name: "Website development",
        description: "Fast, considered websites built to be found, read, and maintained.",
      },
      {
        name: "Application development",
        description: "Web and mobile applications designed around how people really use them.",
      },
      {
        name: "Custom software",
        description: "Software shaped to a specific operation, not bent from a template.",
      },
      {
        name: "UI/UX design",
        description: "Interfaces, flows, and design systems that make complex work feel simple.",
      },
      {
        name: "Digital products & business systems",
        description: "Platforms and internal systems that hold the daily running of a business together.",
      },
    ],
    projects: ["joyno-accounting", "the-beach-park-hadsan", "sharks-tail"],
  },
  {
    id: "automation",
    name: "Automation",
    object: "twist",
    lede: "Systems that take repetitive work off the table, so people can do the work only people can do.",
    services: [
      {
        name: "AI solutions",
        description: "Practical AI applied where it saves real time or opens new capability.",
      },
      {
        name: "Workflow automation",
        description: "Connecting the steps between tools so work moves without manual hand-offs.",
      },
      {
        name: "CRM systems",
        description: "Customer records and pipelines organised around the way you actually sell.",
      },
      {
        name: "Internal business tools",
        description: "Purpose-built tools for the teams who run the day-to-day.",
      },
      {
        name: "AI-powered products & integrations",
        description: "AI features built into products and connected to the services you already use.",
      },
    ],
    projects: ["joynosync", "casatoon"],
  },
  {
    id: "creative",
    name: "Creative",
    object: "loop",
    lede: "Work that gets a business seen, understood, and remembered.",
    services: [
      {
        name: "Digital marketing",
        description: "Campaigns planned around where your customers already spend their attention.",
      },
      {
        name: "Search engine optimization",
        description: "Structure, content, and technical care that help the right people find you.",
      },
      {
        name: "Content creation",
        description: "Writing, photography, and media made for the channels that matter to you.",
      },
      {
        name: "Video editing",
        description: "Edits with pace and purpose, cut for each platform they live on.",
      },
      {
        name: "Social media graphics",
        description: "A consistent visual voice across every post, story, and ad.",
      },
      {
        name: "Campaign design & creative production",
        description: "Ideas taken from first sketch to finished, delivered assets.",
      },
    ],
    projects: ["marketing-content", "nxone-dc"],
  },
];

export const disciplineById = (id: DisciplineId) =>
  disciplines.find((d) => d.id === id) as Discipline;
