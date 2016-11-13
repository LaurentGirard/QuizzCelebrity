package questiongenerator;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable(identityType=IdentityType.APPLICATION)
public class Generator {
	@PrimaryKey
	@Persistent(valueStrategy=IdGeneratorStrategy.IDENTITY)
	Long id;
	
	Question type_question;
	@Persistent
	String answers;
	
	public Generator(String t_question){
		switch (t_question) {
		case "musician":
			type_question = new MusicianQuestion();
			break;
		case "actor":
			type_question = new ActorQuestion();
			break;
		// Can add some types of question here which implements Question
			
		default:
			type_question = new ActorQuestion();
			break;
		}
	}	
	
	public String getAnswers(){
		return answers;
	}
	
	public void setAnswers(String ans){
		answers = ans;
	}
	
	public Question getType_Question(){
		return type_question;
	}
	
	public void setQuestion(Question t_question){
		type_question = t_question;
	}
	
}
