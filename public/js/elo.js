/* winChance :: Float, Float -> Float */
function winChance(player, opponent) {
  return 1 / (1 + (Math.pow(10, (opponent - player) / 400)));
}

function adjust(winner, loser, k = 32) {
  const winnerAdjusted = Math.round(winner + (k * (1 - winChance(winner, loser))));
  const loserAdjusted  = Math.round(loser  + (k * (0 - winChance(loser, winner))));
  return [winnerAdjusted, loserAdjusted]
}

/* test cases
 *
 * winChance(1200.0, 1200.0) = 0.5;
 * adjust(1200.0, 1200.0) = [1216, 1184];
 */

const stuff = winChance(1200.0, 1250.0);
console.log(adjust(1200.0, 1200.0));

