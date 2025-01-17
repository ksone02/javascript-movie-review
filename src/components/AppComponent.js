import CustomComponent from "../abstracts/CustomComponent";
import HeaderComponent from "./AppHeaderComponent";
import MovieListComponent from "./movie/MovieListComponent";
import MoreButtonComponent from "./element/MoreButtonComponent";
import TitleComponent from "./element/TitleComponent";
import transformMovieItemsType from "../util/MovieList";
import { API_KEY } from "../constants/key";
import { ACTION, REQUEST_URL, TITLE } from "../constants/constants";

export default class AppComponent extends CustomComponent {
  #nextPage = 1;
  #totalPage;
  #$movieList;
  #$movieListTitle;
  #$searchInput;

  render() {
    super.render();

    this.#$movieList = this.querySelector("movie-list");
    this.#$movieListTitle = this.querySelector("movie-list-title");
    this.#$searchInput = this.querySelector("input");

    this.popularListInit();
    this.renderListByData(ACTION.POPULAR);
    this.changeMoreButtonAction(ACTION.MORE_POPULAR);
  }

  async fetchAPI(actionType) {
    switch (actionType) {
      case ACTION.POPULAR:
      default:
        return await fetch(
          `${REQUEST_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${
            this.#nextPage
          }`,
          { method: "GET" }
        );
      case ACTION.SEARCH:
        return await fetch(
          `${REQUEST_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${
            this.#$searchInput.value
          }&page=${this.#nextPage}&include_adult=false`,
          { method: "GET" }
        );
    }
  }

  renderListByData(actionType) {
    this.fetchAPI(actionType)
      .then(async (res) => {
        if (!res.ok) {
          this.#$movieList.renderPageFail();
          return;
        }

        const data = await res.json();
        this.#totalPage = data.total_pages;

        const movieItems = transformMovieItemsType(data.results);
        this.#$movieList.renderPageSuccess(movieItems);

        this.#nextPage += 1;
        this.checkHasNextPage();
      })
      .catch((error) => {
        this.#$movieList.renderPageFail();
      });
  }

  checkHasNextPage() {
    if (this.#totalPage < this.#nextPage) {
      this.querySelector("more-button").classList.add("hide");
      return;
    }
    this.querySelector("more-button").classList.remove("hide");
  }

  searchListInit() {
    this.#nextPage = 1;
    this.#$movieListTitle.setTitle(
      `"${this.#$searchInput.value}" ${TITLE.SEARCH}`
    );
    this.#$movieList.initialPage();
  }

  popularListInit() {
    this.#nextPage = 1;

    this.#$searchInput.value = "";
    this.#$movieListTitle.setTitle(TITLE.POPULAR);
    this.#$movieList.initialPage();
  }

  changeMoreButtonAction(actionType) {
    this.querySelector("more-button").setAttribute("data-action", actionType);
  }

  checkEventAction(e) {
    switch (e.target.dataset.action) {
      // 로고 눌렀을 때 액션
      case ACTION.POPULAR:
      default:
        this.popularListInit();
        this.renderListByData(ACTION.POPULAR);
        this.changeMoreButtonAction(ACTION.MORE_POPULAR);
        break;
      // 검색했을 때 액션
      case ACTION.SEARCH:
        if (!this.#$searchInput.value) {
          this.popularListInit();
          this.renderListByData(ACTION.POPULAR);
          this.changeMoreButtonAction(ACTION.MORE_POPULAR);
          return;
        }
        this.searchListInit();
        this.renderListByData(ACTION.SEARCH);
        this.changeMoreButtonAction(ACTION.MORE_SEARCH);
        break;
      // 인기 영화 목록에서 더보기 눌렀을 때 액션
      case ACTION.MORE_POPULAR:
        this.#$movieList.appendNewPage();
        this.renderListByData(ACTION.POPULAR);
        break;
      // 검색 결과 목록에서 더보기 눌렀을 때 액션
      case ACTION.MORE_SEARCH:
        this.#$movieList.appendNewPage();
        this.renderListByData(ACTION.SEARCH);
        break;
    }
  }

  handleEvent() {
    this.addEventListener("click", (e) => {
      this.checkEventAction(e);
    });

    // 검색시 엔터 눌렀을 때 액션
    this.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (!this.#$searchInput.value) {
          this.popularListInit();
          this.renderListByData(ACTION.POPULAR);
          this.changeMoreButtonAction(ACTION.MORE_POPULAR);
          return;
        }

        this.searchListInit();
        this.renderListByData(ACTION.SEARCH);
        this.changeMoreButtonAction(ACTION.MORE_SEARCH);
      }
    });
  }

  template() {
    return `
        <div id="app">
            <app-header></app-header>
            <main>
                <section class="item-view">
                    <movie-list-title></movie-list-title>
                    <movie-list></movie-list>
                    <more-button></more-button>
                </section>
            </main>
        </div>
        `;
  }
}

customElements.define("app-component", AppComponent);
