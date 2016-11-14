package questiongenerator;

public class Answer {
	
	private String name;
	private String date;
	private String country;
	
	public Answer(String n, String d, String nat){
		name = n;
		date = d;
		country = nat;
	}


	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
}
