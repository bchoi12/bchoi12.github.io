
$( document ).ready(function() {
	$("#enter").css("margin-top", (($(window).height() / 2 - $("#enter").height())) + "px");

	$("#enter").click(function() {
		$(window).scrollTop(0);
	
		var timer = 0;
		$("#enter").hide();

		$("#favicon").attr("href","favicon2.png");
		document.title = "captain sharon goes forth!";

		document.getElementById("music").loop = false;
		document.getElementById("music").play();

		var width = $(document).width();
		$("#captain").css("margin-left", "110%");
		$("#sharon").css("margin-left", "-100%");
		$("#goes").css("margin-left", "110%");
		$("#forth").css("margin-left", "-100%");
		$("#text").show();


		$("#container").css("opacity", 0);
		timer += 1000;
		setTimeout(function() {
			$("#container").hide();
		}, 3000);

		var beatMillis = 1900
		var move = 4
		var firstMove = "margin-left 0.5s ease-out";
		var secondMove = "margin-left 3s linear";

		var captainEnd = 18
		timer += beatMillis;
		setTimeout(function() {
			$("#captain").css("transition", firstMove);
			$("#captain").css("margin-left", (captainEnd+move) + "%");

			setTimeout(function() {
				$("#captain").css("transition", secondMove);
				$("#captain").css("margin-left", captainEnd + "%");
			}, 500);
		}, timer);

		var sharonEnd = 24
		timer += beatMillis;
		setTimeout(function() {
			$("#sharon").css("transition", firstMove);
			$("#sharon").css("margin-left", (sharonEnd-move) + "%");

			setTimeout(function() {
				$("#sharon").css("transition", secondMove);
				$("#sharon").css("margin-left", sharonEnd + "%");
			}, 500);
		}, timer);

		var goesEnd = 30
		timer += beatMillis;
		setTimeout(function() {
			$("#goes").css("transition", firstMove);
			$("#goes").css("margin-left", (goesEnd+move) + "%");

			setTimeout(function() {
				$("#goes").css("transition", secondMove);
				$("#goes").css("margin-left", goesEnd + "%");
			}, 500);
		}, timer);

		var forthEnd = 36
		timer += beatMillis;
		setTimeout(function() {
			$("#forth").css("transition", firstMove);
			$("#forth").css("margin-left", (forthEnd-move) + "%");

			setTimeout(function() {
				$("#forth").css("transition", secondMove);
				$("#forth").css("margin-left", forthEnd + "%");
			}, 500);
		}, timer);

		timer += beatMillis * 2;
		setTimeout(function() {
			$("#toad").css("transition", "right 1s ease-out");
			$("#toad").css("right", "10px");
		}, timer);

		timer += beatMillis;
		setTimeout(function() {
			$("#content").css("transition", "opacity 3s linear");
			$("#content").css("opacity", "1.0");
			$("body").css("overflow-y", "scroll");
		}, timer);
	});

});

function scrollPercent() {
	return ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
}