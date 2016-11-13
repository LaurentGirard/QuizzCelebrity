package questiongenerator;

public abstract class Question {
	protected String request;
	
	public String getRequest(){
		return request;
	}
	
	public void setRequest(String req){
		request = req;
	}
}

