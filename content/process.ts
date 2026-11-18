import { people } from "./team";
import { site } from "./site";

/**
 * How we work: the steps of a project and the questions clients ask.
 * Only what the studio has confirmed: prices and timelines are quoted per
 * project in a written proposal, never listed here.
 */

export const steps: { title: string; body: string }[] = [
  {
    title: "Your brief",
    body: "Tell us what you are building, fixing or launching: what it is for, who it serves, and any date that matters. A few lines are enough to start.",
  },
  {
    title: "A conversation",
    body: "We talk it through with you to understand how your team works today, and what takes time or gets lost along the way.",
  },
  {
    title: "A proposal",
    body: "You receive a written proposal: what we will make, how long it will take, and what it will cost.",
  },
  {
    title: "We make it, and launch it",
    body: "We plan, design and build the work, or plan, film and edit it, then launch it with you.",
  },
];

export const faq: { question: string; answer: string }[] = [
  {
    question: "What do you make?",
    answer:
      "Websites and the software a business runs on, such as CRMs and accounting, HR and operations systems; automation that takes repetitive work off people; and creative work, from campaigns and social graphics to video we plan, film and edit.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "It depends on what you need. Every project is priced on its scope: send us a brief and we will reply with a written proposal that includes the price.",
  },
  {
    question: "How long does a project take?",
    answer: "That depends on the scope too. The timeline is set out in your proposal, before any work begins.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "A short brief: what you need, who it is for and any deadline. The project brief on this site takes a couple of minutes, or you can simply email or call us.",
  },
  {
    question: "Do you film the video, or only edit it?",
    answer: "Both. We plan the shoot, film it and edit it.",
  },
  {
    question: "Where are you based?",
    answer: `In ${site.location.city}, ${site.location.country}. We work with clients by video call, email and chat.`,
  },
  {
    question: "Who will I be working with?",
    answer: `The ${site.legalName} team: ${people.length} people across development, design, marketing and video. You can meet everyone on our About page.`,
  },
];
