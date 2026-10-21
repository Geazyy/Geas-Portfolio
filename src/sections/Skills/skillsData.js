// Frontend Logos
import htmlImg from '../../assets/techskills/HTML5.png';
import cssImg from '../../assets/techskills/CSS3.png';
import jsImg from '../../assets/techskills/JavaScript.png';
import tsImg from '../../assets/techskills/TypeScript.png';
import reactImg from '../../assets/react.svg';
import nextImg from '../../assets/techskills/NextJS.png';
import tailwindImg from '../../assets/techskills/Tailwind.png';
import viteImg from '../../assets/techskills/Vite.png';

// Backend Logos
import nodeImg from '../../assets/techskills/NodeJS.png';
import expressImg from '../../assets/techskills/Express.png';
import phpImg from '../../assets/techskills/PHP.png';
import laravelImg from '../../assets/techskills/Laravel.png';
import mysqlImg from '../../assets/techskills/MySQL.png';
import mongoImg from '../../assets/techskills/MongoDB.png';
import firebaseImg from '../../assets/techskills/Firebase.png';
import pythonImg from '../../assets/techskills/Python.png';
import csharpImg from '../../assets/techskills/CSharp.png';
import cppImg from '../../assets/techskills/CPlusPlus.png';
import dartImg from '../../assets/techskills/Dart.png';

// Tool Logos
import gitImg from '../../assets/techskills/Git.png';
import githubImg from '../../assets/techskills/GitHub.png';
import vscodeImg from '../../assets/techskills/VSCode.png';
import composerImg from '../../assets/techskills/Composer.png';

export const technicalSkills = [
  // Frontend first
  { name: 'HTML5', icon: htmlImg, level: 95, cat: 'frontend' },
  { name: 'CSS3', icon: cssImg, level: 90, cat: 'frontend' },
  { name: 'JavaScript', icon: jsImg, level: 85, cat: 'frontend' },
  { name: 'TypeScript', icon: tsImg, level: 80, cat: 'frontend' },
  { name: 'ReactJS', icon: reactImg, level: 85, cat: 'frontend' },
  { name: 'Next.js', icon: nextImg, level: 75, cat: 'frontend' },
  { name: 'Tailwind CSS', icon: tailwindImg, level: 85, cat: 'frontend' },
  { name: 'Vite', icon: viteImg, level: 80, cat: 'frontend' },
  
  // Backend tech
  { name: 'Node.js', icon: nodeImg, level: 80, cat: 'backend' },
  { name: 'Express', icon: expressImg, level: 75, cat: 'backend' },
  { name: 'PHP', icon: phpImg, level: 70, cat: 'backend' },
  { name: 'Laravel', icon: laravelImg, level: 65, cat: 'backend' },
  { name: 'MySQL', icon: mysqlImg, level: 80, cat: 'backend' },
  { name: 'MongoDB', icon: mongoImg, level: 75, cat: 'backend' },
  { name: 'Firebase', icon: firebaseImg, level: 75, cat: 'backend' },
  { name: 'Python', icon: pythonImg, level: 85, cat: 'backend' },
  { name: 'C#', icon: csharpImg, level: 60, cat: 'backend' },
  { name: 'C++', icon: cppImg, level: 65, cat: 'backend' },
  { name: 'Dart', icon: dartImg, level: 55, cat: 'backend' },

  // Tools
  { name: 'Git', icon: gitImg, level: 90, cat: 'tool' },
  { name: 'GitHub', icon: githubImg, level: 85, cat: 'tool' },
  { name: 'VS Code', icon: vscodeImg, level: 95, cat: 'tool' },
  { name: 'Composer', icon: composerImg, level: 70, cat: 'tool' },
];

export const softSkills = [
  { name: 'Communication', level: 90 },
  { name: 'Team Work', level: 85 },
  { name: 'Project Management', level: 80 },
  { name: 'Creativity', level: 75 },
  { name: 'Problem Solving', level: 85 },
  { name: 'Adaptability', level: 80 },
];


export const skillCategories = { frontend: 'Frontend', backend: 'Backend', tool: 'Tools', professional: 'Professional skill' };
