var addOns = {
    portfolioItems: [],
    portfolioMap: {},
    visiblePortfolioCount: 6,
    portfolioStep: 4,
    modalBound: false,

    init: function() {
        this.bindModal();
        this.bindPortfolioActions();
        this.loadPortfolio();
    },

    bindPortfolioActions: function() {
        const loadMoreButton = document.querySelector('#portfolio-load-more');

        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', function() {
                if (addOns.visiblePortfolioCount >= addOns.portfolioItems.length) {
                    addOns.visiblePortfolioCount = addOns.portfolioStep;
                } else {
                    addOns.visiblePortfolioCount += addOns.portfolioStep;
                }

                addOns.renderPortfolio();
            });
        }
    },

    bindModal: function() {
        if (this.modalBound) {
            return;
        }

        const modal = document.querySelector('.modal');
        const closeModal = document.querySelector('.modal__close');

        if (!modal || !closeModal) {
            return;
        }

        closeModal.addEventListener('click', function() {
            addOns.hideModal();
        });

        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                addOns.hideModal();
            }
        });

        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                addOns.hideModal();
            }
        });

        this.modalBound = true;
    },

    hideModal: function() {
        const modal = document.querySelector('.modal');
        if (!modal) {
            return;
        }

        modal.style.display = 'none';
        document.body.style.overflow = '';
    },

    loadPortfolio: async function() {
        const container = document.querySelector('#portfolio-list');

        if (!container) {
            return;
        }

        try {
            const response = await fetch('./assets/data/portfolio.json', {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Portfolio JSON could not be loaded.');
            }

            const data = await response.json();
            this.portfolioItems = Array.isArray(data)
                ? data.sort(function(a, b) {
                    const sortOrderA = Number(a.sortOrder || 0);
                    const sortOrderB = Number(b.sortOrder || 0);

                    if (sortOrderA || sortOrderB) {
                        return sortOrderB - sortOrderA;
                    }

                    const yearA = Number(a.year || 0);
                    const yearB = Number(b.year || 0);

                    return yearB - yearA;
                })
                : [];
            this.portfolioMap = this.portfolioItems.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {});

            this.visiblePortfolioCount = 6;
            this.renderPortfolio(container);
        } catch (error) {
            console.error(error);
            container.innerHTML = '<p class="portfolio__loading portfolio__loading--error">Daftar portofolio gagal dimuat. Jalankan project lewat server web agar file JSON dapat diakses.</p>';
            const loadMoreButton = document.querySelector('#portfolio-load-more');
            if (loadMoreButton) {
                loadMoreButton.style.display = 'none';
            }
        }
    },

    renderPortfolio: function(container) {
        const portfolioContainer = container || document.querySelector('#portfolio-list');
        const loadMoreButton = document.querySelector('#portfolio-load-more');

        if (!portfolioContainer) {
            return;
        }

        const visibleItems = this.portfolioItems.slice(0, this.visiblePortfolioCount);

        if (!visibleItems.length) {
            portfolioContainer.innerHTML = '<p class="portfolio__loading">Belum ada data portfolio.</p>';
            if (loadMoreButton) {
                loadMoreButton.style.display = 'none';
            }
            return;
        }

        portfolioContainer.innerHTML = visibleItems.map(function(item) {
            return addOns.renderPortfolioCard(item);
        }).join('');

        if (loadMoreButton) {
            const hasMore = this.visiblePortfolioCount < this.portfolioItems.length;
            loadMoreButton.style.display = this.portfolioItems.length > this.portfolioStep ? 'inline-flex' : 'none';
            loadMoreButton.textContent = hasMore ? 'Load More' : 'Show Less';
        }

        if (window.appScrollReveal) {
            window.appScrollReveal.reveal('.portfolio__card', { interval: 100 });
        }
    },

    renderPortfolioCard: function(item) {
        const altText = item.imageAlt || item.title;
        const media = item.imageMode === 'object'
            ? `<div class="portfolio__img-wrapper"><object data="${item.image}" aria-label="${altText}"></object></div>`
            : `<img src="${item.image}" alt="${altText}" class="portfolio__img">`;

        return `
            <article class="portfolio__card">
                ${media}
                <div class="portfolio__content">
                    <h3 class="portfolio__title">${item.title}</h3>
                    <p class="portfolio__meta">${item.category}</p>
                    <p class="portfolio__excerpt">${item.excerpt}</p>
                    <a class="portfolio__button" onclick="addOns.showModal(this);" data-isi="${item.id}">
                        View Details <i class='bx bx-right-arrow-alt'></i>
                    </a>
                </div>
            </article>
        `;
    },

    showModal: function(detail) {
        const modal = document.querySelector('.modal');
        const details = detail.getAttribute('data-isi');
        const item = this.portfolioMap[details];

        if (!modal || !item) {
            return;
        }

        this.populateModal(item);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    populateModal: function(item) {
        const imgModal = document.querySelector('#imgModal');
        const titleModal = document.querySelector('#titleModal');
        const contentModal = document.querySelector('#contentModal');
        const linkModal = document.querySelector('#linkModal');

        if (imgModal) {
            imgModal.src = item.modalImage || item.image;
            imgModal.alt = item.imageAlt || item.title;
        }

        if (titleModal) {
            titleModal.textContent = item.modalTitle || item.title;
        }

        if (contentModal) {
            const modalData = item.modal || {};
            const paragraphs = Array.isArray(modalData.paragraphs) ? modalData.paragraphs : [];
            const listItems = Array.isArray(modalData.list) ? modalData.list : [];

            const paragraphHtml = paragraphs.map(function(paragraph) {
                return `<p>${paragraph}</p>`;
            }).join('');

            const listHtml = listItems.length
                ? `<ul>${listItems.map(function(listItem) {
                    if (typeof listItem === 'string') {
                        return `<li>${listItem}</li>`;
                    }

                    const link = listItem.href
                        ? `<a href="${listItem.href}" target="${listItem.target || '_blank'}" rel="noreferrer">${listItem.label}</a>`
                        : listItem.label;
                    const note = listItem.note ? ` ${listItem.note}` : '';

                    return `<li>${link}${note}</li>`;
                }).join('')}</ul>`
                : '';

            contentModal.innerHTML = `${paragraphHtml}${listHtml}`;
        }

        if (linkModal) {
            const links = Array.isArray(item.links) ? item.links : [];

            linkModal.innerHTML = links.map(function(link) {
                if (!link.href || link.href === '#') {
                    return `
                        <span>
                            <i class='bx ${link.icon || 'bx-info-circle'}'></i>
                            ${link.label}
                        </span>
                    `;
                }

                return `
                    <a href="${link.href}" target="${link.target || '_blank'}" rel="noreferrer">
                        <i class='bx ${link.icon || 'bx-globe'}'></i>
                        ${link.label}
                    </a>
                `;
            }).join('');
        }
    },

    urlOrigin: function() {
        return window.location.origin;
    }
}

window.onload = function() {
    addOns.init();
};
