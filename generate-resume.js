const fs = require('fs');
const path = require('path');

const bundlesDir = path.join(__dirname, 'resume-bundles');
const outputDir = path.join(__dirname, 'generated-templates');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(bundlesDir, (err, files) => {
    if (err) {
        console.error('Error reading bundles directory:', err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const bundlePath = path.join(bundlesDir, file);
            fs.readFile(bundlePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                try {
                    const resume = JSON.parse(data);
                    const html = generateHTML(resume);
                    const outputName = path.basename(file, '.json') + '.html';
                    const outputPath = path.join(outputDir, outputName);

                    fs.writeFile(outputPath, html, (err) => {
                        if (err) {
                            console.error(`Error writing file ${outputName}:`, err);
                        } else {
                            console.log(`Generated ${outputName}`);
                        }
                    });
                } catch (parseErr) {
                    console.error(`Error parsing JSON in ${file}:`, parseErr);
                }
            });
        }
    });
});

function generateHTML(resume) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${resume.basics.name} resume</title>
    <link rel="stylesheet" href="../styles.css" />
</head>

<body>
    <header>
        <h1 id="full-name">
            <p class="first">${resume.basics.name.split(' ')[0]}</p>
            <p class="last">${resume.basics.name.split(' ').slice(1).join(' ')}</p>
        </h1>
        <p class="contact-me">
            ${resume.basics.contact.phone} |
            <a href="mailto:${resume.basics.contact.email}">${resume.basics.contact.email}</a> |
            <a href="${resume.basics.contact.github}">github</a> |
            <a href="${resume.basics.contact.linkedin}">linkedin</a>
        </p>
    </header>

    <main>
        ${resume.professional_highlights ? `
        <section id="professional-highlights">
            <h2>PROFESSIONAL HIGHLIGHTS</h2>
            <div class="highlights">
                <ul>
${resume.professional_highlights.map(item => `                    <li>${item}</li>`).join('\n')}
                </ul>
            </div>
        </section>
        ` : ''}

        <section id="experience">
            <h2>EXPERIENCE</h2>
${resume.experience.map((exp, index) => `
            <div class="project${index === 0 ? ' mt-0' : ''}">
                <h3>${exp.company} <span class="description">&#160;|&#160;${exp.role}</span></h3>
                <p class="location">${exp.period} | ${exp.location}</p>
                ${exp.tech_stack ? `<p class="description">${exp.tech_stack}</p>` : ''}
                <ul>
${exp.highlights.map(highlight => `                    <li>${highlight}</li>`).join('\n')}
                </ul>
            </div>
`).join('')}
        </section>

        <section id="skills">
            <h2>SKILLS</h2>
${resume.skills.map((skill, index) => {
        const isList = skill.items.trim().startsWith('<ul');
        return `
            <div class="skill-category${index === 0 ? ' mt-0' : ''}">
                ${isList ? `<h3>${skill.category}</h3>` : `<span>${skill.category}: </span>`}
                ${skill.items}
            </div>
`;
    }).join('')}
        </section>

        <section id="certifications">
            <h2>CERTIFICATIONS</h2>
${resume.certifications.map(cert => `
            <div class="certificate">
                <h3>${cert}</h3>
            </div>
`).join('')}
        </section>

        <section id="education" class="bb-none">
            <h2>EDUCATION</h2>
${resume.education.map(edu => `
            <div class="qualification">
                <h3>${edu.institution} <span class="description">&#160;|&#160;${edu.degree}</span></h3>
                <p class="location">${edu.period} | ${edu.location}</p>
                ${edu.score ? `<p class="location">${edu.score}</p>` : ''}
                <p class="description">${edu.description}</p>
            </div>
`).join('')}
        </section>
    </main>
</body>

</html>`;
}
