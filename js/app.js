const API_Key = "CPVYigSH7QZUbXPwX9IRcqp0GlL5h9pqnpde6jux "

let $welcomeSection = $("#welcome-section")
let $gallerySection = $(".gallery-section");
let $gallery = $(".gallery-box");
let $galleryPicture = $(".gallery-box__picture")
let $nextBtn = $("#next")
let $prevBtn = $("#prev")
let $letsStart = $("#start")
let pictures = null;
let counter = 0;
let viewPictures = []
let clickedPicture
let $nextSlide = $("#gallery-next-slide")
let $prevSlide = $("#gallery-prev-slide")
let dataOrderCurrent = 0
let dataOrderNext = 0
let dataOrderPrev = 0



$letsStart.click(function (e) {
    e.preventDefault();
    $welcomeSection.hide();
    $gallerySection.show();
});

$.ajax({
    url: `https://api.nasa.gov/planetary/apod?api_key=${API_Key}`,
    method: 'GET',
    dataType: 'json'
}).done(function (response) {
    $(".homepage-section").css('background-image', 'url(' + response.url + ')');
}).fail(function (error) {
    console.log(error);
});

$.ajax({
    'async': false,
    type: "GET",
    url: `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_Key}`,
    'success': function (data) {
        console.log(data.photos);
        pictures = data.photos;
    }
});

setGallery = () => {
    for (let i = counter; i < 5; i++) {

        $gallery.append(
            $("<div>").addClass("gallery-box__picture").css('background-image', 'url(' + pictures[i].img_src + ')').attr('data-order', counter)
        )
        counter++
    }

}

nextPictures = (pics) => {
    // pics.remove()
    let nextPart = counter + 5
    for (let i = counter; i < nextPart; i++) {
        viewPictures.push(pictures[i])
        counter++
        console.log(pictures[i]);
        $gallery.append(
            $("<div>").addClass("gallery-box__picture").css('background-image', 'url(' + pictures[i].img_src + ')').attr('data-order', counter - 1)
        )
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
    }
}


setGallery()
$nextBtn.click(function (e) {
    e.preventDefault();
    let $galleryPicture = $(".gallery-box__picture")
    nextPictures($galleryPicture)
});


$gallery.on('click', $galleryPicture, function (e) {
    clickedPicture = e.target
    console.log(clickedPicture);
    let bgImage = $(clickedPicture).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
    $(".big-picture-box").show()
    $(".big-picture").css('background-image', 'url(' + bgImage + ')')
    $('body').addClass('stop-scrolling')
})

$(".close").on('click', function () {
    $(".big-picture-box").hide()
    dataOrderCurrent = 0
    dataOrderNext = 0
    dataOrderPrev = 0
    $('body').removeClass('stop-scrolling')
})


$($nextSlide).on("click", function (e) {

    if (dataOrderCurrent === dataOrderNext) {
        dataOrderCurrent = $(clickedPicture).data("order")
        let nextElement = document.querySelector(`[data-order='${dataOrderCurrent + 1}']`);
        let nextElementImage = $(nextElement).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
        $(".big-picture").css('background-image', 'url(' + nextElementImage + ')')
        dataOrderNext = dataOrderCurrent + 1
    } else {
        if (dataOrderNext < counter) {
            let nextElementNext = document.querySelector(`[data-order='${dataOrderNext}']`);
            let nextElementImageNext = $(nextElementNext).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
            $(".big-picture").css('background-image', 'url(' + nextElementImageNext + ')')
            dataOrderNext = dataOrderNext + 1
        }
    }
})

$($prevSlide).on("click", function (e) {
    console.log(dataOrderPrev);
    console.log(dataOrderCurrent);

    if (dataOrderCurrent === dataOrderPrev) {
        dataOrderCurrent = $(clickedPicture).data("order")
        let nextElement = document.querySelector(`[data-order='${dataOrderCurrent - 1}']`);
        let nextElementImage = $(nextElement).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
        $(".big-picture").css('background-image', 'url(' + nextElementImage + ')')
        dataOrderPrev = dataOrderCurrent - 1

    } else {
        if (dataOrderPrev >= 0) {
            let nextElementPrev = document.querySelector(`[data-order='${dataOrderPrev}']`);
            let nextElementImagePrev = $(nextElementPrev).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
            $(".big-picture").css('background-image', 'url(' + nextElementImagePrev + ')')
            dataOrderPrev = dataOrderPrev - 1
        }
    }
})