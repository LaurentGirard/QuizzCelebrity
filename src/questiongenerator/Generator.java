package questiongenerator;

import java.util.ArrayList;

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
	ArrayList<Answer> good_answers = new ArrayList<Answer>();
	ArrayList<Answer> bad_answers = new ArrayList<Answer>();

	
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

	public Question getType_question() {
		return type_question;
	}

	public void setType_question(Question type_question) {
		this.type_question = type_question;
	}

	public ArrayList<Answer> getAnswers() {
		return good_answers;
	}

	public void setAnswers(ArrayList<Answer> answers) {
		this.good_answers = answers;
	}	
	
}
