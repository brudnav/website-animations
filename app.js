let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides(){
    controller = new ScrollMagic.Controller()


    const sliders = document.querySelectorAll(".slide")
    const nav = document.querySelector(".nav-header")

    sliders.forEach((slide,index,slides)=>{
        const revealImg = slide.querySelector(".reveal-img")
        const img = slide.querySelector("img")
        const revealText = slide.querySelector(".reveal-text")

        const slideTl = gsap.timeline({defaults: {duration: 1, ease: "power2.inOut"}})

        slideTl.fromTo(revealImg, {x:"0%"} , {x:"100%"})
        slideTl.fromTo(img, {scale:2} , {scale:1}, "-=1")
        slideTl.fromTo(revealText, {x: "0%"}, {x: "100%"}, "-=0.75")
        slideTl.fromTo(nav,{y:"-100%"},{y:"0%"})

        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(slideTl)
        .addIndicators({
            colorStart: "white", colorTrigger: "white", name: "slide"
        })
        .addTo(controller)

        //New Anim

        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? "end" :slides[index + 1]
        pageTl.fromTo(nextSlide,{y: "0%"}, {y:"50%"})
        pageTl.fromTo(slide,{opacity: 1, scale: 1}, {opacity: 0, scale: 0.5})
        pageTl.fromTo(nextSlide,{y: "50%"}, {y:"0%"}, "-=0.5")

        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0,
            indent: 200
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        .addIndicators({colorStart: "white", colorTrigger: "white", name: "page"})
        .addTo(controller)
    })
}

const mouse = document.querySelector(".cursor")
const mouseText = mouse.querySelector("span")
const burger = document.querySelector(".burger")
function cursor(e){
    mouse.style.top = e.pageY + "px"
    mouse.style.left = e.pageX + "px"
}
function activeCursor(e){
   const item = e.target

   if(item.id === "logo" || item.classList.contains("burger")){
    mouse.classList.add("nav-active")
   }else{
    mouse.classList.remove("nav-active")
   }
   if(item.classList.contains("explore")){
    mouse.classList.add("explore-active")
    gsap.to(".title-swipe",1,{y:"0%"})
    mouseText.innerText = "Tap"
   }else{
    mouse.classList.remove("explore-active")
    gsap.to(".title-swipe",1,{y:"100%"})
    mouseText.innerText = ""
   }
}

function navToggle(e){
    if(!e.target.classList.contains("active")){
        e.target.classList.add("active")
        gsap.to(".line1",0.5,{rotate: "45", y:5, background: "black"})
        gsap.to(".line2",0.5,{rotate: "-45", y:-5, background: "black"})
        gsap.to("#logo", 1, {color: "black"})
        gsap.to(".nav-bar", 1, {clipPath: "circle(2500px at 100% -10%)"})
        document.body.classList.add("hide")
    }else{
        e.target.classList.remove("active")
        gsap.to(".line1",0.5,{rotate: "0", y:0, background: "white"})
        gsap.to(".line2",0.5,{rotate: "0", y:0, background: "white"})
        gsap.to("#logo", 1, {color: "white"})
        gsap.to(".nav-bar", 1, {clipPath: "circle(50px at 100% -10%)"})
        document.body.classList.remove("hide")
    }
    
}

const logo = document.querySelector("#logo")

barba.init({
    views: [
        {
            namespace: "home",
            beforeEnter(){
                animateSlides()
                logo.href = "./index.html"
            },
            beforeLeave(){
                slideScene.destroy()
                pageScene.destroy()
                controller.destroy()
            }
        },
        {
            namespace: "fashion",
            beforeEnter(){
                logo.href = "../index.html"
                detailAnimation()
                gsap.fromTo(".nav-header", 1, {y: "100%"}, {y:"0%", ease: "power2.inOut"}, "+=0.45")
            },
            beforeLeave(){
                controller.destroy()
                detailScene.destroy()
            }
        },
    ],
    transitions: [
        {
            leave(data){
                window.scrollTo(0,0)
                const tl = gsap.timeline({ defaults: {ease: "power2.inOut"} } );
                tl.fromTo(data.current.container, 1, {opacity: 1}, {opacity: 0})
                tl.fromTo(".swipe", 0.75, {x: "-100%"}, {x: "100%"}, "-=0.3")
                
            },
            enter(data){
                const tl = gsap.timeline({ defaults: {ease: "power2.inOut"} } );
                tl.fromTo(".swipe", 0.75, {x: "0%"}, {x: "100%", stagger: 0.25})
                tl.fromTo(data.next.container, 1, { opacity: 0 }, { opacity: 1});
            }
        }
    ]
})


function detailAnimation(){
    controller = new ScrollMagic.Controller()
    const slides = document.querySelectorAll(".detail-slide")
    slides.forEach((slide,index,slides)=>{
        const slideTl = gsap.timeline({defaults: {duration: 1}})
        let nextSlide = slides.length - 1 === index ? "end" :slides[index + 1]
        const nextImg = nextSlide.querySelector("img")
        slideTl.fromTo(slide,{opacity: 1}, {opacity: 0})
        slideTl.fromTo(nextSlide, {opacity: 0}, {opacity: 1}, "-=1")
        slideTl.fromTo(nextImg, {x: "50%"}, {x: "0%"})
        //Scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(slideTl)
        .addIndicators()
        .addTo(controller)
    })
}

burger.addEventListener("click",navToggle)
window.addEventListener("mousemove",cursor)
window.addEventListener("mousemove",activeCursor)
