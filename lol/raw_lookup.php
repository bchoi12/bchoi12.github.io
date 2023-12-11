<?php

	$summoner = $_POST["summoner"];
	$summoner = str_replace(" ", "", $summoner);
	$region = $_POST["region"];
	$api_key = "c739bbbf-7ffa-4db6-bf97-35d8cad2338b";

	echo "<h2 class = 'linebottom'>Summoner</h2>";
	$url = "https://prod.api.pvp.net/api/lol/$region/v1.1/summoner/by-name/$summoner?api_key=$api_key";
	$data = print_data( $url );
	$id = $data->id;

	echo "<h2 class = 'doubleline'>Summoner Data</h2>";
	$url = "https://prod.api.pvp.net/api/lol/$region/v1.2/stats/by-summoner/$id/summary?api_key=$api_key";
	print_data ( $url );

	echo "<h2 class = 'doubleline'>Ranked Stats</h2>";
	$url = "https://prod.api.pvp.net/api/lol/$region/v1.2/stats/by-summoner/$id/ranked?api_key=$api_key";
	print_data ( $url );

	echo "<h2 class = 'doubleline'>League</h2>";
	$url = "https://prod.api.pvp.net/api/lol/$region/v2.2/league/by-summoner/$id?api_key=$api_key";
	print_data ( $url );

	echo "<h2 class = 'doubleline'>Recent Games</h2>";
	$url = "https://prod.api.pvp.net/api/lol/$region/v1.2/game/by-summoner/$id/recent?api_key=$api_key";
	print_data ( $url );

	echo "<h2 class = 'doubleline'>Teams</h2>";
	$url = "https://prod.api.pvp.net/api/$region/v2.1/team/by-summoner/$id?api_key=$api_key";
	print_data ( $url );

	echo "<h2 class = 'doubleline'>Champions</h2>";
	$url = "https://prod.api.pvp.net/api/lol/$region/v1.1/champion?api_key=$api_key";
	$data = print_data ( $url );

	foreach ($data->champions as $value){
		echo '<br>case "' . $value->name . '":';
	}

	function print_data( $url ){
		$data_string = file_get_contents( $url );
		$data = json_decode( $data_string );

		echo $data_string;
		return $data;
	}
?>