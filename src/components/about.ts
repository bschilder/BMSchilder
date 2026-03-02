import type { CVData } from '../types/cv-data';
import { getYearsExperience } from '../data/csv-loader';

export function initAbout(data: CVData): void {
  const section = document.getElementById('about')!;

  const current = data.experience
    .filter((e) => e.Type === 'research' && (!e.EndYear || e.EndYear === '\\-'))
    .sort((a, b) => b.StartYear - a.StartYear)[0];

  const affiliations = data.profile.filter((p) => p.Type === 'affiliation');

  const pubCount = data.publications.filter((p) => p.Type === 'publication' || p.Type === 'preprint').length;
  const toolCount = data.tools.length;
  const yearsExp = getYearsExperience(data.experience);
  const grantCount = data.grants.filter((g) => g.Type === 'grant').length;

  const bio = generateBio(pubCount, toolCount);

  section.innerHTML = `
    <h2 class="section__title">About</h2>
    <div class="about__grid fade-in">
      <div class="about__photo-wrap">
        <img
          src="${import.meta.env.BASE_URL}photos/Imperial_headshot_bright-min.jpg"
          alt="Brian M. Schilder headshot"
          class="about__photo"
          loading="lazy"
        />
      </div>
      <div class="about__info">
        ${current ? `
          <p class="about__position">${current.Position}</p>
          <p class="about__institution">
            <a href="${current.Link || '#'}" target="_blank" rel="noopener noreferrer">
              ${current.Institution}
            </a>
            ${current.Department ? ` &mdash; ${current.Department}` : ''}
          </p>
        ` : ''}
        <div class="about__bio">${bio}</div>
        <div class="about__metrics">
          <a href="#publications" class="about__metric-link">
            <div class="about__metric">
              <div class="about__metric-value">${pubCount}</div>
              <div class="about__metric-label">Publications</div>
            </div>
          </a>
          <a href="#tools" class="about__metric-link">
            <div class="about__metric">
              <div class="about__metric-value">${toolCount}</div>
              <div class="about__metric-label">Tools</div>
            </div>
          </a>
          <a href="#grants" class="about__metric-link">
            <div class="about__metric">
              <div class="about__metric-value">${grantCount}</div>
              <div class="about__metric-label">Grants</div>
            </div>
          </a>
          <a href="#timeline" class="about__metric-link">
            <div class="about__metric">
              <div class="about__metric-value">${yearsExp}+</div>
              <div class="about__metric-label">Years Research</div>
            </div>
          </a>
        </div>
        <div class="about__affiliations">
          ${affiliations.map((a) => `
            <a href="${a.Link || '#'}" class="about__affiliation" target="_blank" rel="noopener noreferrer">
              ${a.Text}
            </a>
          `).join('')}
        </div>
        <a href="${import.meta.env.BASE_URL}files/B.M.%20Schilder%20CV.pdf"
           class="about__cv-btn"
           target="_blank"
           rel="noopener noreferrer">
          Download CV
        </a>
      </div>
    </div>
  `;
}

function generateBio(pubs: number, tools: number): string {
  return `From excavating Paleolithic hominin sites in Kenya and Serbia to building AI models that map the human genome-phenome landscape, my research has always been driven by a single question: <em>what makes us who we are?</em>

<br><br>I began exploring this at <strong>Brown University</strong>, studying cognitive neuroscience and the neural basis of decision-making. That curiosity pulled me deeper into our evolutionary past through an MPhil at <strong>The George Washington University</strong>, where I investigated hippocampal evolution across primates and joined paleoanthropological field schools spanning three continents.

<br><br>A pivotal shift came when I moved to <strong>Mount Sinai</strong> in New York, where I discovered the power of computational approaches to unlock genomic mechanisms of neurodegeneration. I built machine learning pipelines integrating multi-omics data &mdash; whole-genome sequencing, single-cell transcriptomics, epigenomics &mdash; to identify disease-causal variants and cell types for Alzheimer's and Parkinson's disease.

<br><br>I carried that momentum into a PhD at <strong>Imperial College London</strong> and <strong>The Alan Turing Institute</strong>, systematically dissecting the cell-type-specific mechanisms underlying all rare diseases and constructing a unified latent genomic space of the entire human phenome.

<br><br>Now at <strong>Cold Spring Harbor Laboratory</strong>, I am developing next-generation genomic foundation models to map complex genome-phenome relationships and enable truly personalized disease risk prediction. Throughout this journey, I have authored ${pubs} publications and created ${tools} open-source tools &mdash; because I believe the best science is science that anyone can build upon.`;
}
