export const RESUME_DATA = {
    name: "Daniel Pepuho",
    location: "Jayapura, Papua",
    about: "A student with a focus on networking, programming and system administration. With over 3 years experience as an IT Infra.",
    summary:
        "",
    avatarUrl: "https://avatars.githubusercontent.com/u/69733783?v=4",
    personalWebsiteUrl: "https://danielcristho.site",
    contact: {
        email: "pepuhodaniel93@gmail.com",
        github: "danielcristho",
        linkedin: "daniel-pepuho",
        X: "chrstdan",
    },
    education: [
        {
            school: "Institut Teknologi Sepuluh Nopember",
            degree: "Bachelor's Degree in Informatics",
            start: "2020",
            end: "Present",
        },
    ],
    work: [
        {
            company: "PPDB JATIM",
            link: "https://ppdbjatim.net",
            badges: [],
            title: "IT Infra & DevOps",
            start: "2023",
            end: "2024",
            descriptions: [
                "Role as IT Infrastructure, Responsible for managing server websites, like creating",
                "CI/CD, building configuration management using Ansible, and creating automated scripts.",
                "This is my first experience using Docker in the Production Project.",
            ],
            usedTechnologies: [
                "Ansible",
                "AWS Lambda",
                "Docker",
                "Mariadb",
                "GitHub Actions",
            ],
        },
        {
            company: "PT. Internusa Total Solution",
            title: "IT Network Intern",
            badges: [],
            start: "Jul 2019",
            end: "Oct 2019",
            descriptions: [
                "Responsible for maintaining internet service on the client side.",
                "Monitoring network performance to determine if adjustments need to be made.",
                "Network installation.",
            ],
            usedTechnologies: [
                "Mikrotik",
                "Cisco",
                "Unifi (Ubiqiti)"
            ],
        },

    ],
    skills: [
        "Docker",
        "Ansible",
        "MySQL/Mariadb",
        "PostgreSQL",
        "Python",
        "Cisco",
        "Mikrotik"
    ],
    projects: [
        {
        title: "danielcristho.site",
        techStack: ["Personal Project", "Astro", "Starlight"],
        description:
            "My personal website and blog. Built with Astro and Starlight",
        link: {
                label: "danielcristho.site",
                href: "https://danielcristho.site/",
        },
        },
        {
        title: "ppdbjatim.net",
        techStack: ["Next JS", "Laravel", "Docker", "Mariadb"],
        description:
            "I worked on both the front-end (React.js) app and a Chrome web extension.",
        link: {
                label: "ppdbjatim.net",
                href: "https://pppdjatim.net/",
        },
        },
    ],
} as const;