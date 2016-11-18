package questiongenerator;

public abstract class Question {
	protected String request;
	protected int offset_rand;
	
	public Question(){
		offset_rand = (int) (Math.random() * ( 1000 - 0 )+1);
	}
	
	public String getRequest(){
		return request;
	}
	
	public void setRequest(String req){
		request = req;
	}
}

