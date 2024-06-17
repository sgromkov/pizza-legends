import './constants/OVERWORLD_MAPS';
import './constants/PIZZAS';
import './constants/ACTIONS';
import './constants/BATTLE_ANIMATIONS';
import './State/PlayerState';
import { Overworld } from './Overworld';

(function () {
  const overworld = new Overworld({
    element: document.querySelector('.game-container'),
  });

  overworld.init();
})();
