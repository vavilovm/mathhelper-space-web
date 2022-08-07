import { LOCALES } from "../locale";

import { forPlayersSectionEn } from "./pages/home-page/sections/for-players-section";
import { forTutorsSectionEn } from "./pages/home-page/sections/for-tutors-section";
import { mainCooperationOptionsEn } from "./pages/home-page/sections/main-cooperation-options";
import { heroSectionEn } from "./pages/home-page/sections/hero-section";
import { navigationBarEn } from "./layouts/navigation-bar";
import { ratingsSectionEn } from "./pages/home-page/sections/ratings-section";
import { workFieldsGraphEn } from "./components/work-fields-graph";
import { workFieldsSectionEn } from "./pages/home-page/sections/work-fields-section";
import { ranksSectionEn } from "./pages/home-page/sections/ranks-section";
import { aboutUsSectionEn } from "./pages/home-page/sections/about-us-section";
import { loginRegisterModalEn } from "./modals/login-register-modal";
import { unauthorizedModalEn } from "./modals/unauthorized-modal";
import { footerEn } from "./layouts/footer";
import { gameInfoPageEn } from "./pages/game-info-page/game-info-page";
import { playedGameUsersListEn } from "./pages/game-info-page/components/played-game-users-list";
import { gamesPageEn } from "./pages/games-page/games-page";
import { gameTabEn } from "./pages/games-page/components/game-tab";
import { playersPageEn } from "./pages/players-page/players-page";
import { playerTabEn } from "./pages/players-page/components/player-tab";
import { sorterEn } from "./components/sorter";
import { appTabEn } from "./components/app-tab";
import { playerInfoPageEn } from "./pages/player-info-page";
import { levelInfoPageEn } from "./pages/level-info-page";
import { filterEn } from "./components/filter";
import { appTabHeaderEn } from "./components/app-tab-header";
import { fetchErrorMessageEn } from "./components/fetch-error-message";
import { formsEn } from "./forms/forms";

export default {
  [LOCALES.ENGLISH]: {
    ...workFieldsGraphEn,
    ...forPlayersSectionEn,
    ...forTutorsSectionEn,
    ...mainCooperationOptionsEn,
    ...heroSectionEn,
    ...navigationBarEn,
    ...ratingsSectionEn,
    ...workFieldsSectionEn,
    ...ranksSectionEn,
    ...aboutUsSectionEn,
    ...loginRegisterModalEn,
    ...unauthorizedModalEn,
    ...footerEn,
    ...gameInfoPageEn,
    ...playedGameUsersListEn,
    ...gamesPageEn,
    ...gameTabEn,
    ...playersPageEn,
    ...playerTabEn,
    ...sorterEn,
    ...appTabEn,
    ...playerInfoPageEn,
    ...levelInfoPageEn,
    ...filterEn,
    ...appTabHeaderEn,
    ...fetchErrorMessageEn,
    ...formsEn,
  },
};
