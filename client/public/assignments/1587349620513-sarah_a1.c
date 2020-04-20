
 #include <time.h>
 #include <stdio.h>

int main(void) 
{
	time_t my_timer;
	struct tm *ptr_time;

	time(&my_time);			
	ptr_time = localtime(&my_timer); 
	printf("Today is %s.\nHave a nice day!\n", buffer);

	return 0;
}