package questiongenerator;

public class Answer {
	
	private String name;
	private String date;
	private String birthplace;
	
	public Answer(String q, String n, String d, String bp){
		name = n;
		date = d;
		birthplace = bp;
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
	public String getBirthplace() {
		return birthplace;
	}
	public void setBirthplace(String birthplace) {
		this.birthplace = birthplace;
	}
}
