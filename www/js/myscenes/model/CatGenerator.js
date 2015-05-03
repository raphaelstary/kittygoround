var CatGenerator = (function (range) {
    "use strict";

    function getRandomCat() {
        var random = range(0, 100);
        var cat;
        if (random < 20) {
            cat = 'black_cat';
        } else if (random < 40) {
            cat = 'white_cat';
        } else if (random < 50) {
            cat = 'blue_cat';
        } else if (random < 60) {
            cat = 'brown_cat';
        } else if (random < 70) {
            cat = 'grey_cat';
        } else if (random < 80) {
            cat = 'orange_cat';
        } else if (random < 90) {
            cat = 'red_cat';
        } else {
            cat = 'yellow_cat';
        }
        return cat;
    }

    function getTwoNewCats(existingCats) {
        var cat1;
        var cat2;
        existingCats = existingCats || [];
        do {
            cat1 = getRandomCat();
            cat2 = getRandomCat();
        } while (!everyCatIsDifferent(cat1, cat2, existingCats));

        return [cat1, cat2];
    }

    function everyCatIsDifferent(cat1, cat2, existingCats) {
        return cat1 != cat2 && existingCats.every(function (cat) {
                return cat != cat1 && cat != cat2;
            });
    }

    return {
        getRandomCat: getRandomCat,
        getTwoCats: getTwoNewCats
    };
})(range);