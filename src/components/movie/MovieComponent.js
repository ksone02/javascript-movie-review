import CustomComponent from "../../abstracts/CustomComponent";
import StarEmptyImg from "../../../templates/star_empty.png";
import StarFilledImg from "../../../templates/star_filled.png";
import navigate from "../../util/Navigate";

export default class MovieComponent extends CustomComponent {
  constructor() {
    super();
    this.state = {
      movie: {
        id: 0,
        title: "",
        poster_path: "",
        genre_ids: "",
        vote_average: 0,
        overview: "",
      },
    };
  }

  onModal() {
    const modal = document.createElement("movie-modal");

    Object.keys(this.state.movie).forEach((key) => {
      modal.setAttribute(key, this.state.movie[key]);
    });

    document.querySelector("#app").append(modal);

    setTimeout(() => {
      modal.style.opacity = 1;
    });

    history.pushState(this.state.movie, null, "/info");
  }

  handleEvent() {
    this.addEventListener("click", (e) => {
      e.preventDefault();
      this.onModal();
    });
  }

  template() {
    const movie = {
      id: this.getAttribute("id"),
      title: this.getAttribute("title"),
      poster_path: this.getAttribute("poster_path"),
      genre_ids: this.getAttribute("genre_ids"),
      vote_average: this.getAttribute("vote_average"),
      overview: this.getAttribute("overview"),
    };

    this.state.movie = movie;

    const title = this.state.movie.title;
    const voteAverage = this.state.movie.vote_average;
    const posterPath = this.state.movie.poster_path;

    return /*html*/ `
            <div>
              <div class="item-card">
                  <img
                    class="item-thumbnail"
                    src="https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}"
                    loading="lazy"
                    alt=${title}
                  />
                  <p class="item-title">${title}</p>
                  <p class="item-score"><img src=${StarFilledImg} alt="별점" /> ${voteAverage}</p>
              </div>
            </div>
        `;
  }
}

customElements.define("movie-item", MovieComponent);
