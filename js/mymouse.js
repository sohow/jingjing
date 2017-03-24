/**
 * Created by Administrator on 2016/2/24.
 */
(function(q){
    var ta = q('#mymouse'),
        s = navigator.appVersion.toLowerCase(),
        z = s.indexOf("msie") > -1 ? parseInt(z.replace(/.*msie[ ]/, "").match(/^[0-9]+/)) : 0,
        N = z != 0;

    /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    q(function() {
        window.M = {
            canvas: null,
            ball: [],
            ballImageResource: [],
            subBall: [],
            subBallImageResource: [],
            actionCount: [],
            timerId: null,
            waitCnt: 0,
            curBallIdx: 0,
            mouseX: 0,
            mouseY: 0,
            init: function() {
                for (i = 0; i < 1; i++) {
                    var j = "img/subball" + (i + 1) + ".png";
                    M.ballImageResource[i] = new Image;
                    M.ballImageResource[i].src = j
                }
                for (i = 0; i < 8; i++) j = "img/subball" + (i + 1) + ".png", M.subBallImageResource[i] =
                    new Image, M.subBallImageResource[i].src = j;
                for (i = 0; i < 20; i++) {
                    M.ball[i] = q("<div />", {
                        id: "M_ball_" + i,
                        no: i,
                        css: {
                            position: "absolute",
                            visibility: "hidden",
                            zIndex: "10000"
                        },
                        html: "",
                        click: function() {}
                    }).appendTo("body");
                    M.subBall[i] = [];
                    for (n = 0; n < 3; n++) M.subBall[i][n] = q("<div />", {
                        id: "M_subball_" + i + "_" + n,
                        no: i,
                        subno: n,
                        css: {
                            position: "absolute",
                            visibility: "hidden",
                            zIndex: "10000"
                        },
                        html: "",
                        click: function() {}
                    }).appendTo("body");
                    M.actionCount[i] =
                        0
                }
                q("html").mousemove(function(j) {
                    M.mouseX = j.pageX;
                    M.mouseY = j.pageY;
                    if (M.waitCnt == 0 && M.actionCount[M.curBallIdx] == 0) M.waitCnt = 2, M.actionCount[M.curBallIdx] = 1, M.curBallIdx = M.curBallIdx == 19 ? 0 : M.curBallIdx + 1
                });
                timerId = setInterval("M.action()", 50)
            },
            action: function() {
                for (i = 0; i < 20; i++) switch (M.actionCount[i]) {
                    case 1:
                        var j = M.ballImageResource[M.getRandomNum(1)];
                        M.ball[i].css({
                            background: "url(" + j.src + ") no-repeat",
                            height: j.height,
                            width: j.width
                        });
                        M.move(M.ball[i], {
                            top: M.mouseY + 10,
                            left: M.mouseX + 10
                        });
                        M.animateY(M.ball[i], M.mouseY, 100, "swing", function() {
                            M.actionCount[q(this).attr("no")] = 2
                        });
                        M.setVisible(M.ball[i]);
                        M.actionCount[i] = 0;
                        break;
                    case 2:
                        M.setHidden(M.ball[i]);
                        var l = M.ball[i].position();
                        for (n = 0; n < 3; n++) M.move(M.subBall[i][n], l), M.animateRandomXY(M.subBall[i][n], l.left - 30, l.left + 30, l.top, l.top + 30, 200, "swing", function() {
                            q(this).attr("subno") == 2 && (M.actionCount[q(this).attr("no")] = 3)
                        }), j = M.subBallImageResource[M.getRandomNum(8)], M.subBall[i][n].css({
                            background: "url(" + j.src + ") no-repeat",
                            height: j.height,
                            width: j.width
                        }), N || M.setOpacity(M.subBall[i][n], 1), M.setVisible(M.subBall[i][n]);
                        M.actionCount[i] = 0;
                        break;
                    case 3:
                        for (n = 0; n < 3; n++) l = M.subBall[i][n].position(), N ? M.animateRandomXY(M.subBall[i][n], l.left, l.left, l.top + 10, l.top + 50, 1E3, "linear", function() {
                            q(this).attr("subno") == 2 && (M.actionCount[q(this).attr("no")] = 4)
                        }) : M.animateRandomXYFadeout(M.subBall[i][n], l.left, l.left, l.top + 10, l.top + 50, 1E3, "linear", function() {
                            q(this).attr("subno") == 2 && (M.actionCount[q(this).attr("no")] = 4)
                        });
                        M.actionCount[i] =
                            0;
                        break;
                    case 4:
                        for (n = 0; n < 3; n++) M.setHidden(M.subBall[i][n]);
                        M.actionCount[i] = 0
                }
                M.waitCnt > 0 && M.waitCnt--
            },
            debug: function(j) {
                navigator.appName.indexOf("Microsoft") != -1 ? document.getElementById("debugArea").innerHTML += j + "<br />" : console.log(j)
            },
            getRandomNum: function(j) {
                return Math.floor(Math.random() * j)
            },
            getDocumentHeight: function() {
                return q(document).height()
            },
            getDocumentWidth: function() {
                return q(document).width()
            },
            getViewTop: function() {
                return q(window).scrollTop()
            },
            getViewLeft: function() {
                return q(window).scrollLeft()
            },
            getViewHeight: function() {
                return q(window).height()
            },
            getViewWidth: function() {
                return q(window).width()
            },
            getViewBottom: function() {
                return M.getViewTop() + M.getViewHeight()
            },
            getViewRight: function() {
                return M.getViewLeft() + M.getViewWidth()
            },
            move: function(j, l) {
                j.css({
                    top: l.top,
                    left: l.left
                })
            },
            moveViewTop: function(j) {
                j.css({
                    top: M.getViewTop()
                })
            },
            moveViewBottom: function(j) {
                j.css({
                    top: M.getViewBottom() - j.outerHeight()
                })
            },
            moveViewLeft: function(j) {
                j.css({
                    left: M.getViewLeft()
                })
            },
            moveViewRight: function(j) {
                j.css({
                    left: M.getViewRight() - j.outerWidth()
                })
            },
            moveViewTopLeft: function(j) {
                M.moveViewTop(j);
                M.moveViewLeft(j)
            },
            moveViewTopRight: function(j) {
                M.moveViewTop(j);
                M.moveViewRight(j)
            },
            moveViewBottomLeft: function(j) {
                M.moveViewBottom(j);
                M.moveViewLeft(j)
            },
            moveViewBottomRight: function(j) {
                M.moveViewBottom(j);
                M.moveViewRight(j)
            },
            moveRandomTop: function(j) {
                j.css({
                    top: M.getViewTop() + M.getRandomNum(M.getViewHeight() - j.outerHeight())
                })
            },
            moveRandomLeft: function(j) {
                j.css({
                    left: M.getViewLeft() + M.getRandomNum(M.getViewWidth() - j.outerWidth() - 100)
                })
            },
            animateY: function(j, l, q, r, u) {
                j.animate({
                    top: l
                }, q, r, u)
            },
            animateRandomY: function(j, l, q, r, u, w) {
                M.animateY(j, l + M.getRandomNum(q - l), r, u, w)
            },
            animateX: function(j, l, q,
                               r, u) {
                j.animate({
                    left: l
                }, q, r, u)
            },
            animateRandomX: function(j, l, q, r, u, w) {
                M.animateX(j, l + M.getRandomNum(q - l), r, u, w)
            },
            animateXY: function(j, l, q, r, u, w) {
                j.animate({
                    top: q,
                    left: l
                }, r, u, w)
            },
            animateRandomXY: function(j, l, q, r, u, w, z, N) {
                M.animateXY(j, l + M.getRandomNum(q - l), r + M.getRandomNum(u - r), w, z, N)
            },
            animateXYFadeout: function(j, l, q, r, u, w) {
                j.animate({
                    top: q,
                    left: l,
                    opacity: "0"
                }, r, u, w)
            },
            animateRandomXYFadeout: function(j, l, q, r, u, w, z, N) {
                M.animateXYFadeout(j,
                    l + M.getRandomNum(q - l), r + M.getRandomNum(u - r), w, z, N)
            },
            setOpacity: function(j, l) {
                j.css({
                    opacity: l
                })
            },
            setHidden: function(j) {
                j.css({
                    visibility: "hidden"
                })
            },
            setVisible: function(j) {
                j.css({
                    visibility: "visible"
                })
            }
        }
    });
    q(document).ready(function() {
        M.init()
    })
})(jQuery);