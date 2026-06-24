export interface Badge {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  achievedDate?: string;
  category: "Competitions" | "Datasets" | "Code" | "Community" | "Education" | "Streaks";
  rarest?: boolean;
  iconType: string;
  colorTheme: string; // e.g. "green", "purple", "orange", "blue", "yellow", "grey"
}

export const KAGGLE_BADGES: Badge[] = [
  {
    id: "gs-competitor",
    name: "Getting Started Competitor",
    description: "Made a submission to a Getting Started competition. Getting Started competitions are the easiest, most approachable competitions on Kaggle used as introductions to the field of machine learning.",
    achieved: true,
    achievedDate: "June 21, 2026",
    category: "Competitions",
    iconType: "rocket",
    colorTheme: "green"
  },
  {
    id: "python-coder",
    name: "Python Coder",
    description: "Created a python notebook. Python is one of the most popular general purpose programming languages and has gained widespread use in the machine learning community.",
    achieved: true,
    achievedDate: "June 21, 2026",
    category: "Code",
    iconType: "python",
    colorTheme: "purple"
  },
  {
    id: "code-forker",
    name: "Code Forker",
    description: "Copied a notebook and made changes to it. Copying a notebook (also known as 'forking' a notebook) is a great way to save time, allowing you to quickly build on top of publicly shared work.",
    achieved: true,
    achievedDate: "June 21, 2026",
    category: "Code",
    iconType: "fork",
    colorTheme: "purple"
  },
  {
    id: "kaggle-community",
    name: "Kaggle Community Member",
    description: "Joined the Kaggle Community by creating an account. The first step in a great adventure!",
    achieved: true,
    achievedDate: "June 21, 2026",
    category: "Community",
    iconType: "duck",
    colorTheme: "orange"
  },
  {
    id: "learner",
    name: "Learner",
    description: "Completed a Kaggle Learn Course. Kaggle courses pare down complex topics to their key practical components, so you gain usable skills in hours instead of weeks.",
    achieved: true,
    achievedDate: "June 21, 2026",
    category: "Education",
    iconType: "learn",
    colorTheme: "blue"
  },
  {
    id: "1-year-kaggle",
    name: "1 Year on Kaggle",
    description: "Active on Kaggle for more than 1 year.",
    achieved: false,
    category: "Community",
    iconType: "year-1",
    colorTheme: "grey"
  },
  {
    id: "2-years-kaggle",
    name: "2 Years on Kaggle",
    description: "Active on Kaggle for more than 2 years.",
    achieved: false,
    category: "Community",
    iconType: "year-2",
    colorTheme: "grey"
  },
  {
    id: "5-years-kaggle",
    name: "5 Years on Kaggle",
    description: "Active on Kaggle for more than 5 years.",
    achieved: false,
    category: "Community",
    iconType: "year-5",
    colorTheme: "grey"
  },
  {
    id: "10-years-kaggle",
    name: "10 Years on Kaggle",
    description: "Active on Kaggle for more than 10 years.",
    achieved: false,
    category: "Community",
    iconType: "year-10",
    colorTheme: "grey"
  },
  {
    id: "15-years-kaggle",
    name: "15 Years on Kaggle",
    description: "Active on Kaggle for more than 15 years.",
    achieved: false,
    category: "Community",
    rarest: true,
    iconType: "year-15",
    colorTheme: "grey"
  },
  {
    id: "competitor",
    name: "Competitor",
    description: "Made a submission to a Kaggle competition that is eligible for points or medals. These competitions are full-scale machine learning challenges which pose difficult real world prediction problems.",
    achieved: false,
    category: "Competitions",
    iconType: "competitor",
    colorTheme: "grey"
  },
  {
    id: "research-competitor",
    name: "Research Competitor",
    description: "Made a submission to a Research competition. Research competitions feature problems which are more experimental, may not have a clean or easy solution, and which are integral to a specific domain.",
    achieved: false,
    category: "Competitions",
    iconType: "research",
    colorTheme: "grey"
  },
  {
    id: "community-competitor",
    name: "Community Competitor",
    description: "Made a submission to a Community competition. These competitions are created by other Kagglers including educators, researchers, companies, meetup groups, or hackathon hosts.",
    achieved: false,
    category: "Competitions",
    iconType: "community-comp",
    colorTheme: "grey"
  },
  {
    id: "playground-competitor",
    name: "Playground Competitor",
    description: "Made a submission to a Playground competition. Playground competitions are a “for fun” type of Kaggle competition that is one step above Getting Started in difficulty. They are great for learning.",
    achieved: false,
    category: "Competitions",
    iconType: "playground",
    colorTheme: "grey"
  },
  {
    id: "simulation-competitor",
    name: "Simulation Competitor",
    description: "Made a submission to a Simulation competition. These competitions challenge participants to create intelligent agents which compete in unique game environments.",
    achieved: false,
    category: "Competitions",
    iconType: "simulation",
    colorTheme: "grey"
  },
  {
    id: "santa-competitor",
    name: "Santa Competitor",
    description: "Made a submission to a Santa competition. Santa competitions are Kaggle's annual tradition of hosting a holiday competition focussed on optimization problems.",
    achieved: false,
    category: "Competitions",
    rarest: true,
    iconType: "santa",
    colorTheme: "grey"
  },
  {
    id: "march-mania-competitor",
    name: "March Mania Competitor",
    description: "Made a submission to a March Mania competition. This unique competition series challenges competitors to predict the winners of each years' NCAA basketball tournament.",
    achieved: false,
    category: "Competitions",
    iconType: "basketball",
    colorTheme: "grey"
  },
  {
    id: "code-submitter",
    name: "Code Submitter",
    description: "Made a submission to a code competition. These competitions require the submission of a reproducible bundle of code rather than a simple file of predictions.",
    achieved: false,
    category: "Competitions",
    iconType: "code-sub",
    colorTheme: "grey"
  },
  {
    id: "sub-streak",
    name: "Submission Streak",
    description: "Submitted to a competition for 7 days in a row.",
    achieved: false,
    category: "Streaks",
    iconType: "streak-7",
    colorTheme: "grey"
  },
  {
    id: "super-streak",
    name: "Super Submission Streak",
    description: "Submitted to a competition for 30 days in a row.",
    achieved: false,
    category: "Streaks",
    iconType: "streak-30",
    colorTheme: "grey"
  },
  {
    id: "mega-streak",
    name: "Mega Submission Streak",
    description: "Submitted to a competition for 100 days in a row.",
    achieved: false,
    category: "Streaks",
    rarest: true,
    iconType: "streak-100",
    colorTheme: "grey"
  },
  {
    id: "r-coder",
    name: "R Coder",
    description: "Created an R notebook. R is a programming language for statistical computing and data visualization, it has a long history of use in the sciences.",
    achieved: false,
    category: "Code",
    iconType: "r",
    colorTheme: "grey"
  },
  {
    id: "r-markdown-coder",
    name: "R Markdown Coder",
    description: "Created an R Markdown script. R Markdown allows you to write a traditional code file (in R) and have it render in a form similar to a notebook. This is great for presenting code alongside narrative.",
    achieved: false,
    category: "Code",
    iconType: "rmarkdown",
    colorTheme: "grey"
  },
  {
    id: "code-uploader",
    name: "Code Uploader",
    description: "Uploaded a notebook. With the import feature you can upload notebook files to Kaggle. This allows you to work on your local machine and upload your work when you are ready to share or submit it.",
    achieved: false,
    category: "Code",
    iconType: "upload",
    colorTheme: "grey"
  },
  {
    id: "api-notebook",
    name: "API Notebook Creator",
    description: "Imported a notebook using the Kaggle API. Use the Kaggle API for convenience or as part of an automated workflow.",
    achieved: false,
    category: "Code",
    iconType: "api",
    colorTheme: "grey"
  },
  {
    id: "github-coder",
    name: "Github Coder",
    description: "Imported a notebook from Github or linked a notebook to Github. You can import or sync notebooks from Github. When synced each version you save on Kaggle can be committed back to your Github repo.",
    achieved: false,
    category: "Code",
    iconType: "github",
    colorTheme: "grey"
  },
  {
    id: "colab-coder",
    name: "Colab Coder",
    description: "Imported a notebook from Colab or opened a notebook in Colab. You can easily import notebooks from Colab (to share or submit on Kaggle). Likewise you can open any Kaggle notebook in Colab to edit.",
    achieved: false,
    category: "Code",
    iconType: "colab",
    colorTheme: "grey"
  },
  {
    id: "code-tagger",
    name: "Code Tagger",
    description: "Added tags to a notebook. Tagging a notebook makes it more discoverable across Kaggle.",
    achieved: false,
    category: "Code",
    iconType: "tag",
    colorTheme: "grey"
  },
  {
    id: "notebook-modeler",
    name: "Notebook Modeler",
    description: "Used a model in a notebook. Pretrained models from the Kaggle Model Hub are powerful tools for taking your work to the next level.",
    achieved: false,
    category: "Code",
    iconType: "model",
    colorTheme: "grey"
  },
  {
    id: "utility-scripter",
    name: "Utility Scripter",
    description: "Created a utility script. You can set a script on Kaggle to a utility script from the file menu. Then you can import it into any other notebook, using the functions from it whenever you like.",
    achieved: false,
    category: "Code",
    iconType: "wrench",
    colorTheme: "grey"
  },
  {
    id: "dataset-creator",
    name: "Dataset Creator",
    description: "Created a dataset. It’s easy to create a dataset on Kaggle and doing so is a great way to start a data science portfolio, share reproducible research, or work with collaborators on a project.",
    achieved: false,
    category: "Datasets",
    iconType: "database",
    colorTheme: "grey"
  },
  {
    id: "dataset-pipeline",
    name: "Dataset Pipeline Creator",
    description: "Created a dataset from notebook output. Creating a dataset from a notebook’s output files will let you create reproducible data pipelines. This can also be used to automatically update datasets.",
    achieved: false,
    category: "Datasets",
    iconType: "pipeline",
    colorTheme: "grey"
  },
  {
    id: "linked-dataset",
    name: "Linked Dataset Creator",
    description: "Created a dataset from a link to a remote URL, Github repository, or Google Cloud Storage bucket. This can be much quicker than uploading from your local machine.",
    achieved: false,
    category: "Datasets",
    iconType: "link-db",
    colorTheme: "grey"
  },
  {
    id: "api-dataset",
    name: "API Dataset Creator",
    description: "Created a dataset using the Kaggle API. Use the Kaggle API for convenience or as part of an automated workflow.",
    achieved: false,
    category: "Datasets",
    iconType: "api-db",
    colorTheme: "grey"
  },
  {
    id: "dataset-documenter",
    name: "Dataset Documenter",
    description: "Created a dataset with a perfect usability rating of 10. Improving the usability rating of a dataset means documenting it comprehensively so that it is easy for others to use with confidence.",
    achieved: false,
    category: "Datasets",
    iconType: "document-db",
    colorTheme: "grey"
  },
  {
    id: "dataset-tagger",
    name: "Dataset Tagger",
    description: "Added tags to a dataset. Tagging a dataset makes it more discoverable across Kaggle.",
    achieved: false,
    category: "Datasets",
    iconType: "tag-db",
    colorTheme: "grey"
  },
  {
    id: "model-creator",
    name: "Model Creator",
    description: "Created a model. Kaggle Models is a repository of pre-trained models that are deeply integrated with Kaggle's platform, making them easy to use in Kaggle Competitions and Notebooks.",
    achieved: false,
    category: "Datasets",
    iconType: "brain",
    colorTheme: "grey"
  },
  {
    id: "model-variation",
    name: "Model Variation Creator",
    description: "Created a model with multiple variations. Variations are used to add finer level details about a model, varying across parameters such as model size, optimization, task, architecture, language, etc.",
    achieved: false,
    category: "Datasets",
    iconType: "layers",
    colorTheme: "grey"
  },
  {
    id: "model-pipeline",
    name: "Model Pipeline Creator",
    description: "Created a model from notebook output. After training a model in a notebook you can save it to the Kaggle Model Hub. This model can then be used in future notebooks, skipping the need to train again.",
    achieved: false,
    category: "Datasets",
    iconType: "pipeline-model",
    colorTheme: "grey"
  },
  {
    id: "linked-model",
    name: "Linked Model Creator",
    description: "Created a model from a link to a remote URL, Github repository, or Google Cloud Storage bucket. This can be much quicker than uploading from your local machine.",
    achieved: false,
    category: "Datasets",
    iconType: "link-model",
    colorTheme: "grey"
  },
  {
    id: "api-model",
    name: "API Model Creator",
    description: "Created a model from the Kaggle API. Use the Kaggle API for convenience or as part of an automated workflow.",
    achieved: false,
    category: "Datasets",
    iconType: "api-model",
    colorTheme: "grey"
  },
  {
    id: "model-documenter",
    name: "Model Documenter",
    description: "Created a model with a perfect usability rating of 10. Improving the usability rating of a model means documenting it comprehensively so that it is easy for others to use with confidence.",
    achieved: false,
    category: "Datasets",
    iconType: "document-model",
    colorTheme: "grey"
  },
  {
    id: "model-tagger",
    name: "Model Tagger",
    description: "Added tags to a model. Tagging a model makes it more discoverable across Kaggle.",
    achieved: false,
    category: "Datasets",
    iconType: "tag-model",
    colorTheme: "grey"
  },
  {
    id: "comp-modeler",
    name: "Competition Modeler",
    description: "Used a model in a competition notebook. Pretrained models are powerful tools for taking your competition submissions to the next level.",
    achieved: false,
    category: "Competitions",
    iconType: "model-comp",
    colorTheme: "grey"
  },
  {
    id: "benchmark-local",
    name: "Benchmark Task local builder",
    description: "Built and pushed a Kaggle Benchmarks task from your local dev environment using the Kaggle CLI.",
    achieved: false,
    category: "Code",
    iconType: "terminal",
    colorTheme: "grey"
  },
  {
    id: "stylish",
    name: "Stylish",
    description: "Filled out their profile. The Kaggle profile is the best place to show off machine learning achievements. This badge is earned by adding a profile picture, tagline, bio, and pinning an item.",
    achieved: false,
    category: "Community",
    iconType: "stylish",
    colorTheme: "grey"
  },
  {
    id: "collector",
    name: "Collector",
    description: "Created a collection. Collections are folders of items you can find inside the 'Your Work' section. They can be used to organize your own files or to keep track of content from across Kaggle.",
    achieved: false,
    category: "Community",
    iconType: "collector",
    colorTheme: "grey"
  },
  {
    id: "bookmarker",
    name: "Bookmarker",
    description: "Bookmarked something on Kaggle. Most things on Kaggle can be bookmarked. You can view your bookmarks in the sidebar or the 'Your Work' section to quickly get back to them.",
    achieved: false,
    category: "Community",
    iconType: "bookmark",
    colorTheme: "grey"
  },
  {
    id: "vampire",
    name: "Vampire",
    description: "Turned on the Kaggle dark theme. You can make this change under settings. Dark mode is a popular alternative color scheme for the site which many people find easier on the eyes.",
    achieved: false,
    category: "Community",
    iconType: "vampire",
    colorTheme: "grey"
  },
  {
    id: "discord-agent",
    name: "Agent of Discord",
    description: "Joined the Kaggle Discord and linked your account. Discord is a popular chatroom platform that is more casual than traditional forums. You can join the Kaggle server here: discord.gg/kaggle",
    achieved: false,
    category: "Community",
    iconType: "discord",
    colorTheme: "grey"
  },
  {
    id: "student",
    name: "Student",
    description: "Completed 5 Kaggle Learn Courses. Kaggle courses pare down complex topics to their key practical components, so you gain usable skills in hours instead of weeks.",
    achieved: false,
    category: "Education",
    iconType: "student",
    colorTheme: "grey"
  },
  {
    id: "graduate",
    name: "Graduate",
    description: "Completed 10 Kaggle Learn Courses. Kaggle courses pare down complex topics to their key practical components, so you gain usable skills in a hours instead of weeks.",
    achieved: false,
    category: "Education",
    iconType: "graduate",
    colorTheme: "grey"
  },
  {
    id: "genai-intensive",
    name: "Completed 5-Day Gen AI Intensive",
    description: "Completed the 5-Day Gen AI Intensive Course. Run in 2024 and 2025. Participants attended daily seminars, studied white papers, completed daily assignments, and a capstone project about Generative AI.",
    achieved: false,
    category: "Education",
    iconType: "genai",
    colorTheme: "grey"
  },
  {
    id: "agents-intensive",
    name: "5-Day AI Agents Intensive Course with Google",
    description: "Completed the 5-Day AI Agents Intensive Course 2025. Participants attended daily seminars, studied white papers, completed daily assignments, and created a capstone project about AI agents.",
    achieved: false,
    category: "Education",
    rarest: true,
    iconType: "agents",
    colorTheme: "grey"
  },
  {
    id: "so-road-safety",
    name: "Stack Overflow Road Safety Challenge Badge",
    description: "For users who both entered the Kaggle Predicting Road Accident Risk Playground Series - Season 5, Episode 10 Competition, and the corresponding Stack Overflow Challenge, building a web application.",
    achieved: false,
    category: "Competitions",
    iconType: "stack-overflow",
    colorTheme: "grey"
  },
  {
    id: "founding-benchmark",
    name: "Founding Benchmark Task Author",
    description: "Contributed a task to a Kaggle Benchmark as an early-access member. Your task evaluating AI model capabilities helped to improve Kaggle Benchmarks and demonstrate the product before its launch.",
    achieved: false,
    category: "Competitions",
    rarest: true,
    iconType: "founding",
    colorTheme: "grey"
  },
  {
    id: "login-streak-7",
    name: "7 Day Login Streak",
    description: "Logged in to Kaggle 7 days in a row.",
    achieved: false,
    category: "Streaks",
    iconType: "streak-7",
    colorTheme: "grey"
  },
  {
    id: "login-streak-30",
    name: "30 Day Login Streak",
    description: "Logged in to Kaggle 30 days in a row.",
    achieved: false,
    category: "Streaks",
    iconType: "streak-30",
    colorTheme: "grey"
  },
  {
    id: "login-streak-100",
    name: "100 Day Login Streak",
    description: "Logged in to Kaggle 100 days in a row.",
    achieved: false,
    category: "Streaks",
    iconType: "streak-100",
    colorTheme: "grey"
  },
  {
    id: "login-streak-365",
    name: "Year Long Login Streak",
    description: "Logged in to Kaggle 365 days in a row.",
    achieved: false,
    category: "Streaks",
    rarest: true,
    iconType: "streak-365",
    colorTheme: "grey"
  }
];
