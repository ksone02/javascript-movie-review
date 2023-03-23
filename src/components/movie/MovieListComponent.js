import CustomComponent from "../../abstracts/CustomComponent";
import MovieComponent from "./MovieComponent";
import ErrorComponent from "./ErrorComponent";
import { MOVIES_PER_PAGE } from "../../constants/constants";

export default class MovieListComponent extends CustomComponent {
  #page;

  initialPage() {
    this.#page = ``;
    this.innerHTML = ``;
  }

  appendNewPage() {
    const errorPage = this.querySelector("error-page");
    if (errorPage) {
      errorPage.remove();
    }

    this.#page = /*html*/ `
          <div class="skeleton-card">
            <div class="item-card skeleton">
              <div class="item-thumbnail skeleton"></div>
              <div class="item-title skeleton"></div>
              <div class="item-score skeleton"></div>
            </div>
          </div>
      `.repeat(MOVIES_PER_PAGE);

    this.insertAdjacentHTML("beforeend", this.#page);
  }

  noResultRender() {
    this.classList.add("no-result-list");

    this.innerHTML = /*html*/ `
        <div class="no-result-box">
          <h1 class="no-result-title">검색 결과를 찾지 못하였습니다.</h1>
          <ul class="no-result-recommends">
            <li>단어의 철자가 정확한지 확인해 보세요.</li>
            <li>검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해 보세요.</li>
            <li>두 단어 이상의 검색어인 경우, 띄어쓰기를 확인해 보세요.</li>
          </ul>
        </div>
      `;
  }

  renderPageSuccess(movieItems) {
    if (!movieItems.length) {
      this.noResultRender();

      return;
    }

    this.classList.remove("no-result-list");

    this.querySelectorAll(".skeleton-card").forEach((el) => {
      el.remove();
    });

    this.#page = `
            ${movieItems
              .map((movieItem) => {
                return `
                  <movie-item
                    id="${movieItem.id}"
                    title="${movieItem.title}"
                    poster_path="${movieItem.poster_path}"
                    vote_average="${movieItem.vote_average}"
                  >
                  </movie-item>`;
              })
              .join("")}
        `;

    this.insertAdjacentHTML("beforeend", this.#page);
  }

  renderPageFail() {
    if (this.querySelector("error-page")) return;

    const errorPage = document.createElement("error-page");
    this.append(errorPage);
  }
}

customElements.define("movie-list", MovieListComponent);
