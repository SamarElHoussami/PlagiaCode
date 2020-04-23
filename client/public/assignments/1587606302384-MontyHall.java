import java.io.*;
import java.util.*;

public class MontyHall{
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		int games, doors;
		float wins = 0;
		boolean switch_doors; 
		char ans;

		System.out.println("How many times would you like me to play the game?");
		games = in.nextInt();

		System.out.println("Should I switch doors when given a chance or not? (y/n)");
		ans = in.next().charAt(0);

		switch_doors = ans == 'y'? true : false;

		//System.out.println("How many doors are in each game?");
		//doors = in.nextInt();

		Random car = new Random();
		Random choice = new Random();

		for(int i = 0; i < games; i++) {
			// Obtain a number between [1 - doors].
			int door_car = car.nextInt(3) + 1;
			int door_choice = choice.nextInt(3) + 1;
			int door_reveal = 1;
			int door_switch = 1;

			for(int y = 1; y <= 3; y++) {
				if(door_reveal == door_car || door_reveal == door_choice) {
					door_reveal++;
				}
				else{
					break;
				} 
			}

			for(int y = 1; y <= 3; y++) {
				if(door_switch == door_reveal || door_switch == door_choice){
					door_switch++;
				}
				else{
					break;
				}
			}


			System.out.print("game #" + (i+1) + ": I chose door #" + door_choice + ". It's not behind #" + door_reveal + " and I am ");
			
			if(switch_doors)
			{
				System.out.println(" switching doors, so I choose door #" + door_switch + ". The car is actually behind door #" + door_car);
					if(door_switch == door_car) {
						wins++;
				}
			}

			else {
				System.out.println(" not switching, so I stay on door #" + door_switch + ". The car is actually behind door #" + door_car);
				if(door_choice == door_car) {
						wins++;
				}
			}

		}
		
		System.out.println("\n\nAfter playing " + games + " times, I won " + (wins/games)*100 + "% times by ");

		if(switch_doors) {
			System.out.println("switching doors");
		}

		else {
			System.out.println("not switching doors");
		}
	}
}
