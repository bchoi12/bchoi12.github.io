<?php
	$summoner = $_POST["summoner"];
	$summoner = str_replace(" ", "", $summoner);
	$region = $_POST["region"];
	$api_key = "c739bbbf-7ffa-4db6-bf97-35d8cad2338b";

	$id_data = get_data( "https://prod.api.pvp.net/api/lol/$region/v1.1/summoner/by-name/$summoner?api_key=$api_key" );
	$id = $id_data->id;

	if (!isset($id)){
		echo "<div id='error' style='white-space: normal;'>Error: summoner not found; either the summoner ($summoner) does not exist or the LoL API is currently unavailable. <a href='javascript:history.go(0)'>Try again?</a></div>";
		die();
	}

	$summoner = $id_data->name;

	$league = get_data( "https://prod.api.pvp.net/api/lol/$region/v2.2/league/by-summoner/$id?api_key=$api_key" );
	$data = get_data( "https://prod.api.pvp.net/api/lol/$region/v1.2/stats/by-summoner/$id/ranked?api_key=$api_key" );

	$tier_name = $league->$id->name;

	if (!isset($tier_name)){
		echo "<div id='error' style='white-space: normal;'>Error: summoner not found; either the summoner ($summoner) has no ranked data or the LoL API is currently unavailable. <a href='javascript:history.go(0)'>Try again?</a></div>";
		die();
	}

	$tier = $league->$id->tier;
	$rank = "";
	$lp = 0;
	foreach($league->$id->entries as $value){
		if ($value->playerOrTeamId == $id){
			$rank = $value->rank;
			$lp = $value->leaguePoints;
		}
	}

	$num_games = 0;					// DONE
	$num_wins = 0;					// DONE
	$num_losses = 0;				// DONE
	$mp_champ = "";					// DONE
	$mp_champ_games = 0;			// DONE
	$mp_champ_percentage = "";		// DONE
	$total_kills = 0;				// DONE
	$doubles = 0;					// DONE
	$triples = 0;					// DONE
	$quadras = 0;					// DONE
	$pentas = 0;					// DONE
	$total_damage = 0;				//
	$total_minions = 0;				// DONE
	$total_monsters = 0;			// DONE
	$total_turrets = 0;				// DONE
	$total_gold = 0;				//
	$most_kills = 0;				// DONE
	$most_kills_champ = "";			// DONE
	$most_kills_per_game = 0;		// DONE
	$most_kills_per_game_champ = "";	// DONE
	$most_kills_per_game_string = "";	// DONE
	$most_kills_per_game_games = 0;	// DONE
	$most_assists_per_game = 0;		// DONE
	$most_assists_per_game_champ = "";	// DONE
	$most_assists_per_game_string = "";	// DONE
	$most_assists_per_game_games = 0;	// DONE
	$highest_winrate = 0;			// DONE
	$highest_winrate_champ = "";	// DONE
	$highest_winrate_percentage = "";	// DONE
	$highest_winrate_games = 0;		// DONE
	$longest_game = 0;				// DONE
	$longest_life = 0;				// DONE
	$longest_spree = 0;				//
	$largest_crit = 0;				//

	$found_legit_avg = 0;

	foreach ( $data->champions as $value ){
		if (strcmp($value->name, "Combined") == 0){
			$num_games = $value->stats->totalSessionsPlayed;
			$num_wins = $value->stats->totalSessionsWon;
			$num_losses = $value->stats->totalSessionsLost;
			$total_kills = $value->stats->totalChampionKills;
			$doubles = $value->stats->totalDoubleKills;
			$triples = $value->stats->totalTripleKills;
			$quadras = $value->stats->totalQuadraKills;
			$pentas = $value->stats->totalPentaKills;
			$total_damage = $value->stats->totalDamageDealt;
			$total_minions = $value->stats->totalMinionKills;
			$total_monsters = $value->stats->totalNeutralMinionsKilled;
			$total_turrets = $value->stats->totalTurretsKilled;
			$total_gold = $value->stats->totalGoldEarned;
			$longest_game = $value->stats->maxTimePlayed;
			$longest_life = $value->stats->maxTimeSpentLiving;
			$longest_spree = $value->stats->maxLargestKillingSpree;
			$largest_crit = $value->stats->maxLargestCriticalStrike;
		} else {
			if ($value->stats->totalSessionsPlayed > $mp_champ_games){
				$mp_champ_games = $value->stats->totalSessionsPlayed;
				$mp_champ = $value->name;
				$mp_champ_percentage = number_format(100 * $value->stats->totalSessionsWon / $value->stats->totalSessionsPlayed, 1, '.', '');
			}
			if ($value->stats->maxChampionsKilled > $most_kills){
				$most_kills = $value->stats->maxChampionsKilled;
				$most_kills_champ = $value->name;
			}
			if($value->stats->totalSessionsPlayed > 4){
				if ($value->stats->totalChampionKills / $value->stats->totalSessionsPlayed > $most_kills_per_game || $found_legit_avg == 0){
					$most_kills_per_game = $value->stats->totalChampionKills / $value->stats->totalSessionsPlayed;
					$most_kills_per_game_champ = $value->name;
					$most_kills_per_game_string = number_format($most_kills_per_game, 1, '.', '');
					$most_kills_per_game_games = $value->stats->totalSessionsPlayed;
				}
				if ($value->stats->totalAssists / $value->stats->totalSessionsPlayed > $most_assists_per_game || $found_legit_avg == 0){
					$most_assists_per_game = $value->stats->totalAssists / $value->stats->totalSessionsPlayed;
					$most_assists_per_game_champ = $value->name;
					$most_assists_per_game_string = number_format($most_assists_per_game, 1, '.', '');
					$most_assists_per_game_games = $value->stats->totalSessionsPlayed;
				}
				if (100 * $value->stats->totalSessionsWon / $value->stats->totalSessionsPlayed > $highest_winrate || $found_legit_avg == 0){
					$highest_winrate = 100 * $value->stats->totalSessionsWon / $value->stats->totalSessionsPlayed;
					$highest_winrate_champ = $value->name;
					$highest_winrate_percentage = number_format($highest_winrate, 1, '.', '');
					$highest_winrate_games = $value->stats->totalSessionsPlayed;
				}
				$found_legit_avg = 1;
			} else if ($found_legit_avg == 0){
				if ($value->stats->totalChampionKills / $value->stats->totalSessionsPlayed > $most_kills_per_game){
					$most_kills_per_game = $value->stats->totalChampionKills / $value->stats->totalSessionsPlayed;
					$most_kills_per_game_champ = $value->name;
					$most_kills_per_game_string = number_format($most_kills_per_game, 1, '.', '');
					$most_kills_per_game_games = $value->stats->totalSessionsPlayed;
				}
				if ($value->stats->totalAssists / $value->stats->totalSessionsPlayed > $most_assists_per_game){
					$most_assists_per_game = $value->stats->totalAssists / $value->stats->totalSessionsPlayed;
					$most_assists_per_game_champ = $value->name;
					$most_assists_per_game_string = number_format($most_assists_per_game, 1, '.', '');
					$most_assists_per_game_games = $value->stats->totalSessionsPlayed;
				}
				if (100 * $value->stats->totalSessionsWon / $value->stats->totalSessionsPlayed > $highest_winrate){
					$highest_winrate = 100 * $value->stats->totalSessionsWon / $value->stats->totalSessionsPlayed;
					$highest_winrate_champ = $value->name;
					$highest_winrate_percentage = number_format($highest_winrate, 1, '.', '');
					$highest_winrate_games = $value->stats->totalSessionsPlayed;
				}
			}
		}
	}

	$mp_champ_bg = get_champion_image($mp_champ);
	$most_kills_champ_bg = get_champion_image($most_kills_champ);
	$most_kills_per_game_champ_bg = get_champion_image($most_kills_per_game_champ);
	$most_assists_per_game_champ_bg = get_champion_image($most_assists_per_game_champ);
	$highest_winrate_champ_bg = get_champion_image($highest_winrate_champ);
	echo "<div id='info'>
		<span id='info_mp_champ_bg'>$mp_champ_bg</span>
		<span id='info_most_kills_champ_bg'>$most_kills_champ_bg</span>
		<span id='info_most_kills_per_game_champ_bg'>$most_kills_per_game_champ_bg</span>
		<span id='info_most_assists_per_game_champ_bg'>$most_assists_per_game_champ_bg</span>
		<span id='info_highest_winrate_champ_bg'>$highest_winrate_champ_bg</span>
		</div>";

	$scroll_message = "scroll to begin";
	$rand = rand(1, 4);

	if ($summoner == "bp101"){
		$scroll_message = "VALKMASTER101";
	} else if ($summoner == "whatwouldchudo"){
		$scroll_message = "THE CHEM GOD";
	} else if ($summoner == "Mr Capt Planet"){
		$scroll_message = "SWAG GOD PLANET";
	} else if ($summoner == "WheeTree"){
		$scroll_message = "w33h4w";
	} else if ($summoner == "JohnLaurain"){
		$scroll_message = "TUBBO ON DUTY";
	} else if ($rand == 1){
		$scroll_message = "this'll be a blast!";
	} else if ($rand == 2){
		$scroll_message = "how about a magic trick?";
	} else if ($rand == 3){
		$scroll_message = "ok.";
	} else if ($rand == 4){
		$scroll_message = "here we go!";
	}

	echo "<div id='title_frame' class='pin'>
		<h1 id='summoner'>$summoner</h1>
		<h4 id='scroll_message'><span id='behind_scroll_message'>$scroll_message &darr;</span><span id='real_scroll_message'>$scroll_message &darr;</span></h4>
		</div>";

	$image_dir = get_rank_image($tier, $rank);

	echo "<div id='tier_frame' class='pin'>
		<h2 id='tier_name'>$tier_name</h2>
		<img id='tier_image' src='tier/{$image_dir}.png' alt='$tier $rank'>
		<h3 id='tier_info'>$tier $rank $lp LP</h3>
		</div>";

	echo "<div id='num_games_frame' class='pin'>
		<h1 id='num_games'>$num_games games</h1>
		<h1 id='num_wins'>$num_wins wins</h1>
		<h1 id='num_losses'>$num_losses losses</h1>
		</div>";

	echo "<div id='total_destruction_frame' class='pin'>
		<h1 id='total_minions'>$total_minions minions</h1>
		<h1 id='total_monsters'>$total_monsters monsters</h1>
		<h1 id='total_turrets'>$total_turrets turrets</h1>
		</div>";

	// has the background
	$kills_per_game = number_format($total_kills / $num_games, 1, '.', '');
	echo "<div id='total_kills_frame' class='pin'>
		<h2 id='total_kills'>$total_kills total kills</h2>
		<h3 id='kills_per_game'>that's $kills_per_game kills per game</h3>
		</div>";

	$doubles_per_game = get_per_game( $doubles, $num_games );
	echo "<div id='doubles_frame' class='pin'>
		<h2 id='doubles'>$doubles double kills</h2>
		<h3 id='doubles_per_game'>$doubles_per_game</h3>
		</div>";

	$triples_per_game = get_per_game( $triples, $num_games );
	echo "<div id='triples_frame' class='pin'>
		<h2 id='triples'>$triples triple kills</h2>
		<h3 id='triples_per_game'>$triples_per_game</h3>
		</div>";

	$quadras_per_game = get_per_game( $quadras, $num_games );
	echo "<div id='quadras_frame' class='pin'>
		<h2 id='quadras'>$quadras quadrakills</h2>
		<h3 id='quadras_per_game'>$quadras_per_game</h3>
		</div>";

	$pentas_per_game = get_per_game( $pentas, $num_games );
	echo "<div id='pentas_frame' class='pin'>
		<h2 id='pentas'>$pentas pentakills</h2>
		<h3 id='pentas_per_game'>$pentas_per_game</h3>
		</div>";

	// ok get rid of background now

	echo "<div id='before_mp_champ_frame' class='pin'>
		<h2 id='before_mp_champ'>Most played champion...</h2>
		</div>";

	$disp_mp_champ = beautify($mp_champ);
	$disp_mp_champ_title = title($mp_champ);
	echo "<div id='mp_champ_frame' class='pin'>
		<h2 id='mp_champ'>$disp_mp_champ</h2>
		<h3 id='mp_champ_title'>$disp_mp_champ_title</h3>
		<h3 id='mp_champ_games'>$mp_champ_games games</h3><h3 id='mp_champ_percentage'>{$mp_champ_percentage}% winrate</h3>
		</div>";

	echo "<div id='before_most_kills_champ_frame' class='pin'>
		<h2 id='before_most_kills_champ'>Most kills in one game...</h2>
		</div>";

	$disp_most_kills_champ = beautify($most_kills_champ);
	$disp_most_kills_champ_title = title($most_kills_champ);
	echo "<div id='most_kills_champ_frame' class='pin'>
		<h2 id='most_kills_champ'>$disp_most_kills_champ</h2>
		<h3 id='most_kills_champ_title'>$disp_most_kills_champ_title</h3>
		<h3 id='most_kills'>$most_kills kills</h3>
		</div>";

	echo "<div id='before_most_kills_per_game_champ_frame' class='pin'>
		<h2 id='before_most_kills_per_game_champ'>Most kills per game...</h2>
		</div>";

	$disp_most_kills_per_game_champ = beautify($most_kills_per_game_champ);
	$disp_most_kills_per_game_champ_title = title($most_kills_per_game_champ);
	echo "<div id='most_kills_per_game_champ_frame' class='pin'>
		<h2 id='most_kills_per_game_champ'>$disp_most_kills_per_game_champ</h2>
		<h3 id='most_kills_per_game_champ_title'>$disp_most_kills_per_game_champ_title</h3>
		<h3 id='most_kills_per_game'>$most_kills_per_game_string kills per game over $most_kills_per_game_games games</h3>
	</div>";

	echo "<div id='before_most_assists_per_game_champ_frame' class='pin'>
		<h2 id='before_most_assists_per_game_champ'>Most assists per game...</h2>
		</div>";

	$disp_most_assists_per_game_champ = beautify($most_assists_per_game_champ);
	$disp_most_assists_per_game_champ_title = title($most_assists_per_game_champ);
	echo "<div id='most_assists_per_game_champ_frame' class='pin'>
		<h2 id='most_assists_per_game_champ'>$disp_most_assists_per_game_champ</h2>
		<h3 id='most_assists_per_game_champ_title'>$disp_most_assists_per_game_champ_title</h3>
		<h3 id='most_assists_per_game'>$most_assists_per_game_string assists per game over $most_assists_per_game_games games</h3>
	</div>";

	echo "<div id='before_highest_winrate_champ_frame' class='pin'>
		<h2 id='before_highest_winrate_champ'>Highest winrate...</h2>
		</div>";

	$disp_highest_winrate_champ = beautify($highest_winrate_champ);
	$disp_highest_winrate_champ_title = title($highest_winrate_champ);
	echo "<div id='highest_winrate_champ_frame' class='pin'>
		<h2 id='highest_winrate_champ'>$disp_highest_winrate_champ</h2>
		<h3 id='highest_winrate_champ_title'>$disp_highest_winrate_champ_title</h3>
		<h3 id='highest_winrate'>{$highest_winrate_percentage}% over $highest_winrate_games games</h3>
	</div>";

	echo "<div id='random_stats_frame' class='pin'>
		<h2 id='random_stats'>Random stats...</h2>
	</div>";

	$MINION_TIME = 90; // for minion spawn
	$minion_spawn_time = get_time($MINION_TIME * $num_games);
	echo "<div id='minion_spawn_time_frame' class='pin'>
		<h1 id='minion_spawn_time'><span id='mst_1'>You've spent</span><br><span id='mst_2'>$minion_spawn_time</span><br><span id='mst_3'>waiting for minions to spawn!</span></h1>
	</div>";

	$disp_longest_game = get_time($longest_game);
	echo "<div id='longest_game_frame' class='pin'>
		<h2 id='longest_game'><span id='lg_1'>Your longest game spanned</span><br><span id='lg_2'>$disp_longest_game</span></h2>
	</div>";

	$disp_longest_game_gold = get_passive_gold_gain($longest_game);
	echo "<div id='longest_game_gold_frame' class='pin'>
		<h2 id='longest_game_gold'><span id='lgg_1'>In that game, you gained</span><br><span id='lgg_2'>{$disp_longest_game_gold}g</span><br><span id='lgg_3'>from passive gold gain alone!</span></h2>
		</div>";

	$disp_longest_life = get_time($longest_life);
	echo "<div id='longest_life_frame' class='pin'>
		<h2 id='longest_life'><span id='ll_1'>Your longest life spanned</span><br><span id='ll_2'>$disp_longest_life</span></h2>
	</div>";

	$disp_longest_life_gold = get_passive_gold_gain($longest_life);
	echo "<div id='longest_life_gold_frame' class='pin'>
		<h2 id='longest_life_gold'><span id='llg_1'>In one life, you gained</span><br><span id='llg_2'>{$disp_longest_life_gold}g</span><br><span id='llg_3'>from passive gold gain alone!</span></h2>
		</div>";

	$disp_longest_spree = "you were " . get_spree($longest_spree);
	echo "<div id='longest_spree_frame' class='pin'>
		<h2 id='longest_spree'><span id='ls_1'>Your longest spree was $longest_spree kills;</span><br><span id='ls_2'>$disp_longest_spree</span></h2>
		</div>";

	$disp_total_damage_time = get_ashe_time($total_damage);
	echo "<div id='total_damage_frame' class='pin'>
		<h2 id='total_damage'><span id='td_1'>You've done $total_damage total damage;</span><br><span id='td_2'>it would take a level one Ashe (without passive)</span><br><span id='td_3'>$disp_total_damage_time</span><br><span id='td_4'>to match your total damage!</span></h2>
		</div>";

	$disp_total_gold_time = get_time( $total_gold / 1.9 );
	echo "<div id='total_gold_frame' class='pin'>
		<h2 id='total_gold'><span id='tg_1'>You've earned and pillaged {$total_gold}g;</span><br><span id='tg_2'>it would take</span><br><span id='tg_3'>$disp_total_gold_time</span><br><span id='tg_4'>of passive gold gain to get that!</span></h2>
		</div>";

	$disp_sonas = get_sonas($largest_crit);
	if ( $disp_sonas == 0){
		echo "<div id='largest_crit_frame' class='pin'>
			<h2 id='largest_crit'><span id='lc_1'>Your largest critical did $largest_crit damage;</span><br><span id='lc_2'>I guess you don't use crit much...</span></h2>
			</div>";
	} else {
		$sonas = "Sonas";
		if ($disp_sonas == 1){
			$sonas = "Sona";
		}
		echo "<div id='largest_crit_frame' class='pin'>
			<h2 id='largest_crit'><span id='lc_1'>Your largest critical did $largest_crit damage;</span><br><span id='lc_2'>that's $disp_sonas level one $sonas!</span></h2>
			</div>";
	}

	echo "<div id='credits'>
		<div id='credits_title'><h1>Credits</h1></div>
		<div id='credits_1'><h2>Created using data from the LoL API<br><br>Animations done using Superscrollorama by John Polacek</h2></div>
		<div id='credits_2'><h3>Reverse Annie Background created by AlexisFire-eXe<br><br>Cute Volibear Background created by scriptkittie</h3></div>
		<div id='credits_3'><h2>Site created by Brian Choi</h2></div>
	</div>";

	function get_data( $url ){
		$data_string = file_get_contents( $url );
		$data = json_decode( $data_string );

		return $data;
	}

	function beautify( $name ){
		switch($name){
			case "DrMundo":
				return "Dr. Mundo";
			case "FiddleSticks":
				return "Fiddlesticks";
			case "JarvanIV":
				return "Jarvan IV";
			case "Khazix":
				return "Kha'Zix";
			case "LeeSin":
				return "Lee Sin";
			case "MasterYi":
				return "Master Yi";
			case "MissFortune":
				return "Miss Fortune";
			case "MonkeyKing":
				return "Wukong";
			case "TwistedFate":
				return "Twisted Fate";
			case "Xin Zhao":
				return "Xin Zhao";
			default:
				return $name;
		}
	}

	function get_ashe_time ( $damage ){
		$ASHE_DPM = 1828; // APPROX DAMAGE PER MINUTE

		return get_time(round( $damage / $ASHE_DPM * 60 ));
	}

	function get_sonas($crit){
		$SONA_HEALTH = 380; // at lvl 1
		return floor( $crit / $SONA_HEALTH );
	}

	function get_time ( $number ){ // number in seconds
		$w_string = "weeks";
		$d_string = "days";
		$h_string = "hours";
		$m_string = "minutes";
		$s_string = "seconds";

		$number = round($number);

		$s = $number % 60;
		$m = floor($number / 60);
		$h = 0;

		while ($m > 59){
			$m -= 60;
			$h += 1;
		}

		while ($h > 23 ){
			$h -= 24;
			$d += 1;
		}

		while ($d > 6){
			$d -= 7;
			$w += 1;
		}

		if ($s == 1){
			$s_string = "second";
		}
		if ($m == 1){
			$m_string = "minute";
		}
		if ($h == 1){
			$h_string = "hour";
		}
		if ($d == 1){
			$d_string = "day";
		}
		if ($w == 1){
			$w_string = "week";
		}

		if ($w == 0 && $d == 0 && $h == 0){
			return $m . " " . $m_string . " and " . $s . " " . $s_string;
		} else if ($w == 0 && $d == 0){
			return $h . " " . $h_string . ", " . $m . " " . $m_string . " and " . $s . " " . $s_string;
		} else if ($w == 0){
			return $d . " " . $d_string . ", " . $h . " " . $h_string . ", " . $m . " " . $m_string . " and " . $s . " " . $s_string;
		} else {
			return $w . " " . $w_string . ", " . $d . " " . $d_string . ", " . $h . " " . $h_string . ", " . $m . " " . $m_string . " and " . $s . " " . $s_string;
		}
	}

	function get_spree ( $number ){
		if ($number > 8){
			return "legendary " . ($number - 7) . " times over!!";
		} else {
			switch($number){
				case 2:
					return "worth more gold!";
				case 3:
					return "on a killing spree!";
				case 4:
					return "on a rampage!";
				case 5:
					return "unstoppable!";
				case 6:
					return "dominating!";
				case 7:
					return "godlike!";
				case 8:
					return "legendary!";
				default:
					return "wait...really??";
			}
		}
	}

	function get_passive_gold_gain ( $number ){
		return round($number * 1.9);
	}

	function get_per_game ( $number, $games ){
		$game_str = "";
		$average = "";
		if ($number == 0){
			return "you'll get one eventually!!";
		} else if ($number > $games){
			if (round($number/$games) == 1){
				$average = "about once";
				$game_str = "per game";
			} else {
				$average = "about " . number_format(round($number/$games), 0, '.', '') . " times";
				$game_str = "per game";
			}
		} else {
			if ($number == $games || round($games/$number) == 1){
				$average = "about once";
				$game_str = "per game";
			} else {
				$average = "about once";
				$game_str = "per " . number_format(round($games/$number), 0, '.', '') . " games";
			}
		}
		return "occurs " . $average . " " . $game_str;
	}

	function title ( $name ){ // oh god this is gonna suck
		switch($name){
			case "Aatrox":
				return "the Darkin Blade";
			case "Ahri":
				return "the Nine-Tailed Fox";
			case "Akali":
				return "the Fist of Shadow";
			case "Alistar":
				return "the Minotaur";
			case "Amumu":
				return "the Sad Mummy";
			case "Anivia":
				return "the Cryophoenix";
			case "Annie":
				return "the Dark Child";
			case "Ashe":
				return "the Frost Archer";
			case "Blitzcrank":
				return "the Great Steam Golem";
			case "Brand":
				return "the Burning Vengeance";
			case "Caitlyn":
				return "the Sheriff of Piltover";
			case "Cassiopeia":
				return "the Serpent's Embrace";
			case "Chogath":
				return "the Terror of the Void";
			case "Corki":
				return "the Daring Bombardier";
			case "Darius":
				return "the Hand of Noxus";
			case "Diana":
				return "Scorn of the Moon";
			case "Draven":
				return "the Glorious Executioner";
			case "DrMundo":
				return "the Madman of Zaun";
			case "Elise":
				return "the Spider Queen";
			case "Evelynn":
				return "the Widowmaker";
			case "Ezreal":
				return "the Prodigal Explorer";
			case "FiddleSticks":
				return "the Harbinger of Doom";
			case "Fiora":
				return "the Grand Duelist";
			case "Fizz":
				return "the Tidal Trickster";
			case "Galio":
				return "the Sentinel's Sorrow";
			case "Gangplank":
				return "the Saltwater Scourge";
			case "Garen":
				return "the Might of Demacia";
			case "Gragas":
				return "the Rabble Rouser";
			case "Graves":
				return "the Outlaw";
			case "Hecarim":
				return "the Shadow of War";
			case "Heimerdinger":
				return "the Revered Inventor";
			case "Irelia":
				return "the Will of the Blades";
			case "Janna":
				return "the Storm's Fury";
			case "JarvanIV":
				return "the Exemplar of Demacia";
			case "Jax":
				return "Grandmaster at Arms";
			case "Jayce":
				return "the Defender of Tomorrow";
			case "Jinx":
				return "the Loose Cannon";
			case "Karma":
				return "the Enlightened One";
			case "Karthus":
				return "the Deathsinger";
			case "Kassadin":
				return "the Void Walker";
			case "Katarina":
				return "the Sinister Blade";
			case "Kayle":
				return "the Judicator";
			case "Kennen":
				return "the Heart of the Tempest";
			case "Khazix":
				return "the Voidreaver";
			case "KogMaw":
				return "the Mouth of the Abyss";
			case "Leblanc":
				return "the Deceiver";
			case "LeeSin":
				return "the Blind Monk";
			case "Leona":
				return "the Radiant Dawn";
			case "Lissandra":
				return "the Ice Witch";
			case "Lucian":
				return "the Purifier";
			case "Lulu":
				return "the Fae Sorceress";
			case "Lux":
				return "the Lady of Luminosity";
			case "Malphite":
				return "Shard of the Monolith";
			case "Malzahar":
				return "the Prophet of the Void";
			case "Maokai":
				return "the Twisted Treant";
			case "MasterYi":
				return "the Wuju Bladesman";
			case "MissFortune":
				return "the Bounty Hunter";
			case "MonkeyKing":
				return "the Monkey King";
			case "Mordekaiser":
				return "the Master of Metal";
			case "Morgana":
				return "Fallen Angel";
			case "Nami":
				return "the Tidecaller";
			case "Nasus":
				return "the Curator of the Sands";
			case "Nautilus":
				return "the Titan of the Depths";
			case "Nidalee":
				return "the Bestial Huntress";
			case "Nocturne":
				return "the Eternal Nightmare";
			case "Nunu":
				return "the Yeti Rider";
			case "Olaf":
				return "the Berserker";
			case "Orianna":
				return "the Lady of Clockwork";
			case "Pantheon":
				return "the Artisan of War";
			case "Poppy":
				return "the Iron Ambassador";
			case "Quinn":
				return "Demacia's Wings";
			case "Rammus":
				return "the Armordillo";
			case "Renekton":
				return "the Butcher of the Sands";
			case "Rengar":
				return "the Pridestalker";
			case "Riven":
				return "the Exile";
			case "Rumble":
				return "the Mechanized Menace";
			case "Ryze":
				return "the Rogue Mage";
			case "Sejuani":
				return "the Winter's Wrath";
			case "Shaco":
				return "the Demon Jester";
			case "Shen":
				return "Eye of Twilight";
			case "Shyvana":
				return "the Half-Dragon";
			case "Singed":
				return "the Mad Chemist";
			case "Sion":
				return "the Undead Champion";
			case "Sivir":
				return "the Battle Mistress";
			case "Skarner":
				return "the Crystal Vanguard";
			case "Sona":
				return "Maven of the Strings";
			case "Soraka":
				return "the Starchild";
			case "Swain":
				return "the Master Tactician";
			case "Syndra":
				return "the Dark Sovereign";
			case "Talon":
				return "the Blade's Shadow";
			case "Taric":
				return "the Gem Knight";
			case "Teemo":
				return "the Swift Scout";
			case "Thresh":
				return "the Chain Warden";
			case "Tristana":
				return "the Megling Gunner";
			case "Trundle":
				return "the Troll King";
			case "Tryndamere":
				return "the Barbarian King";
			case "TwistedFate":
				return "the Card Master";
			case "Twitch":
				return "the Plague Rat";
			case "Udyr":
				return "the Spirit Walker";
			case "Urgot":
				return "the Headsman's Pride";
			case "Varus":
				return "the Arrow of Retribution";
			case "Vayne":
				return "the Night Hunter";
			case "Veigar":
				return "the Tiny Master of Evil";
			case "Vi":
				return "the Piltover Enforcer";
			case "Viktor":
				return "the Machine Herald";
			case "Vladimir":
				return "the Crimson Reaper";
			case "Volibear":
				return "the Thunder's Roar";
			case "Warwick":
				return "the Blood Hunter";
			case "Xerath":
				return "the Magus Ascendant";
			case "XinZhao":
				return "the Seneschal of Demacia";
			case "Yasuo":
				return "the Unforgiven";
			case "Yorick":
				return "the Gravedigger";
			case "Zac":
				return "the Secret Weapon";
			case "Zed":
				return "the Master of Shadows";
			case "Ziggs":
				return "the Hexplosives Expert";
			case "Zilean":
				return "the Chronokeeper";
			case "Zyra":
				return "Rise of the Thorns";
			default:
				return "";
		}

	}

	function rank_to_number ( $rank ){
		switch($rank){
			case "V":
				return 5;
			case "IV":
				return 4;
			case "III":
				return 3;
			case "II":
				return 2;
			case "I":
				return 1;
			default:
				return 1; // wtf
		}
	}

	function get_rank_image ( $tier, $rank ){
		return strtolower($tier) . "_" . rank_to_number($rank);
	}

	// ALBUM HERE: http://imgur.com/a/EIX58
	function get_champion_image ( $name ){
		switch($name){
			case "Aatrox":
				return "http://i.imgur.com/0IrNvSZ.jpg";
			case "Ahri":
				return "http://i.imgur.com/AEdEfag.jpg";
			case "Akali":
				return "http://i.imgur.com/vq2A2wT.jpg";
			case "Alistar":
				return "http://i.imgur.com/UAjZVVr.jpg";
			case "Amumu":
				return "http://i.imgur.com/W0yrYLE.jpg";
			case "Anivia":
				return "http://i.imgur.com/YuZQepl.jpg";
			case "Annie":
				return "http://i.imgur.com/zwUlT0q.jpg";
			case "Ashe":
				return "http://i.imgur.com/wKsUWIh.jpg";
			case "Blitzcrank":
				return "http://i.imgur.com/RogYFtQ.jpg";
			case "Brand":
				return "http://i.imgur.com/LLtSxCN.jpg";
			case "Caitlyn":
				return "http://i.imgur.com/WQK3eyy.jpg";
			case "Cassiopeia":
				return "http://i.imgur.com/WT3C3tA.jpg";
			case "Chogath":
				return "http://i.imgur.com/6iJnkoJ.jpg";
			case "Corki":
				return "http://i.imgur.com/aZbm1TV.jpg";
			case "Darius":
				return "http://i.imgur.com/vUadxmU.jpg";
			case "Diana":
				return "http://i.imgur.com/53G1vGo.jpg";
			case "Draven":
				return "http://i.imgur.com/nLjdGMp.jpg";
			case "DrMundo":
				return "http://i.imgur.com/hndGmEW.jpg";
			case "Elise":
				return "http://i.imgur.com/jExcpy8.jpg";
			case "Evelynn":
				return "http://i.imgur.com/oMo802M.jpg";
			case "Ezreal":
				return "http://i.imgur.com/pT6jU2G.jpg";
			case "FiddleSticks":
				return "http://i.imgur.com/1mmzYlk.jpg";
			case "Fiora":
				return "http://i.imgur.com/ILyEoqU.jpg";
			case "Fizz":
				return "http://i.imgur.com/xkhxDMV.jpg";
			case "Galio":
				return "http://i.imgur.com/vflTTix.jpg";
			case "Gangplank":
				return "http://i.imgur.com/W942ORU.jpg";
			case "Garen":
				return "http://i.imgur.com/K9dlFsA.jpg";
			case "Gragas":
				return "http://i.imgur.com/cudLl3h.jpg";
			case "Graves":
				return "http://i.imgur.com/BxdKopp.jpg";
			case "Hecarim":
				return "http://i.imgur.com/PNqw9D6.jpg";
			case "Heimerdinger":
				return "http://i.imgur.com/xsNNgMo.jpg";
			case "Irelia":
				return "http://i.imgur.com/7vi7iyg.jpg";
			case "Janna":
				return "http://i.imgur.com/XiTl8qU.jpg";
			case "JarvanIV":
				return "http://i.imgur.com/lowye4U.jpg";
			case "Jax":
				return "http://i.imgur.com/IvOrd6s.jpg";
			case "Jayce":
				return "http://i.imgur.com/VMSghyw.jpg";
			case "Jinx":
				return "http://i.imgur.com/iReVswq.jpg";
			case "Karma":
				return "http://i.imgur.com/v3t4kKu.jpg";
			case "Karthus":
				return "http://i.imgur.com/zEOQEAz.jpg";
			case "Kassadin":
				return "http://i.imgur.com/uy4j9hv.jpg";
			case "Katarina":
				return "http://i.imgur.com/tQ3REt2.jpg";
			case "Kayle":
				return "http://i.imgur.com/vd8zVOf.jpg";
			case "Kennen":
				return "http://i.imgur.com/Ve6FUer.jpg";
			case "Khazix":
				return "http://i.imgur.com/J4sF1fJ.jpg";
			case "KogMaw":
				return "http://i.imgur.com/B76QYch.jpg";
			case "Leblanc":
				return "http://i.imgur.com/2uhMe2E.jpg";
			case "LeeSin":
				return "http://i.imgur.com/R76myZT.jpg";
			case "Leona":
				return "http://i.imgur.com/uzBmLNO.jpg";
			case "Lissandra":
				return "http://i.imgur.com/9UbVRMu.jpg";
			case "Lucian":
				return "http://i.imgur.com/SsEAjBr.jpg";
			case "Lulu":
				return "http://i.imgur.com/ZR0M0mz.jpg";
			case "Lux":
				return "http://i.imgur.com/3aLVHcH.jpg";
			case "Malphite":
				return "http://i.imgur.com/Pk5Tvvv.jpg";
			case "Malzahar":
				return "http://i.imgur.com/Qx7noAv.jpg";
			case "Maokai":
				return "http://i.imgur.com/mtUKUy8.jpg";
			case "MasterYi":
				return "http://i.imgur.com/6NJ0dMN.jpg";
			case "MissFortune":
				return "http://i.imgur.com/P9VGEej.jpg";
			case "MonkeyKing":
				return "http://i.imgur.com/vCXKUTt.jpg";
			case "Mordekaiser":
				return "http://i.imgur.com/l43V06i.jpg";
			case "Morgana":
				return "http://i.imgur.com/LTbsiBp.jpg";
			case "Nami":
				return "http://i.imgur.com/TNIW7yN.jpg";
			case "Nasus":
				return "http://i.imgur.com/KDHMX0m.jpg";
			case "Nautilus":
				return "http://i.imgur.com/qGtbkbe.jpg";
			case "Nidalee":
				return "http://i.imgur.com/PfU53Qs.jpg";
			case "Nocturne":
				return "http://i.imgur.com/O1bdfBG.jpg";
			case "Nunu":
				return "http://i.imgur.com/suxCAey.jpg";
			case "Olaf":
				return "http://i.imgur.com/byzeOVv.jpg";
			case "Orianna":
				return "http://i.imgur.com/AdBqUGz.jpg";
			case "Pantheon":
				return "http://i.imgur.com/JeY8GFD.jpg";
			case "Poppy":
				return "http://i.imgur.com/PGOkWYL.jpg";
			case "Quinn":
				return "http://i.imgur.com/1Qkmwj1.jpg";
			case "Rammus":
				return "http://i.imgur.com/54bTRUY.jpg";
			case "Renekton":
				return "http://i.imgur.com/g6ItSJH.jpg";
			case "Rengar":
				return "http://i.imgur.com/krSIiN3.jpg";
			case "Riven":
				return "http://i.imgur.com/s4eC3Bi.jpg";
			case "Rumble":
				return "http://i.imgur.com/wKuuW4S.jpg";
			case "Ryze":
				return "http://i.imgur.com/HzM0P52.jpg";
			case "Sejuani":
				return "http://i.imgur.com/Fcx9YCz.jpg";
			case "Shaco":
				return "http://i.imgur.com/ILFxRbE.jpg";
			case "Shen":
				return "http://i.imgur.com/iz8lpGt.jpg";
			case "Shyvana":
				return "http://i.imgur.com/rS1u4JP.jpg";
			case "Singed":
				return "http://i.imgur.com/rCPpLtk.jpg";
			case "Sion":
				return "http://i.imgur.com/0hcctus.jpg";
			case "Sivir":
				return "http://i.imgur.com/Fp9hAFu.jpg";
			case "Skarner":
				return "http://i.imgur.com/eivtl5Q.jpg";
			case "Sona":
				return "http://i.imgur.com/1KKgquY.jpg";
			case "Soraka":
				return "http://i.imgur.com/2uOlvC3.jpg";
			case "Swain":
				return "http://i.imgur.com/oLBO8jl.jpg";
			case "Syndra":
				return "http://i.imgur.com/SFpShdo.jpg";
			case "Talon":
				return "http://i.imgur.com/gMLKfgg.jpg";
			case "Taric":
				return "http://i.imgur.com/qB4jO7G.jpg";
			case "Teemo":
				return "http://i.imgur.com/sEXBH9I.jpg";
			case "Thresh":
				return "http://i.imgur.com/7dtDlq5.jpg";
			case "Tristana":
				return "http://i.imgur.com/qKfy4c8.jpg";
			case "Trundle":
				return "http://i.imgur.com/8UhqLgP.jpg";
			case "Tryndamere":
				return "http://i.imgur.com/F22Lwrv.jpg";
			case "TwistedFate":
				return "http://i.imgur.com/WOxitR1.jpg";
			case "Twitch":
				return "http://i.imgur.com/p25HxGN.jpg";
			case "Udyr":
				return "http://i.imgur.com/z6fcPPR.jpg";
			case "Urgot":
				return "http://i.imgur.com/hQikfAl.jpg";
			case "Varus":
				return "http://i.imgur.com/IEPXYr1.jpg";
			case "Vayne":
				return "http://i.imgur.com/BDT7dLx.jpg";
			case "Veigar":
				return "http://i.imgur.com/EqOXChO.jpg";
			case "Vi":
				return "http://i.imgur.com/okidDoM.jpg";
			case "Viktor":
				return "http://i.imgur.com/yX61LKi.jpg";
			case "Vladimir":
				return "http://i.imgur.com/QQfrRp9.jpg";
			case "Volibear":
				return "http://i.imgur.com/sXmM7gL.jpg";
			case "Warwick":
				return "http://i.imgur.com/bMIKqr7.jpg";
			case "Xerath":
				return "http://i.imgur.com/p9ccMGd.jpg";
			case "XinZhao":
				return "http://i.imgur.com/DoWymkc.jpg";
			case "Yasuo":
				return "http://i.imgur.com/NN8agWV.jpg";
			case "Yorick":
				return "http://i.imgur.com/BIGbAl8.jpg";
			case "Zac":
				return "http://i.imgur.com/OKJ875t.jpg";
			case "Zed":
				return "http://i.imgur.com/V36Flvz.jpg";
			case "Ziggs":
				return "http://i.imgur.com/20lz4yi.jpg";
			case "Zilean":
				return "http://i.imgur.com/g0eNFMh.jpg";
			case "Zyra":
				return "http://i.imgur.com/z7DvBci.jpg";
			default:
				return "title_back";
		}
	}
?>