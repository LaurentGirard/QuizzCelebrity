package api;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Entity;

public class JsonResponse {
	@PrimaryKey
	@Persistent(valueStrategy=IdGeneratorStrategy.IDENTITY)
	Long id;
	
	@Persistent
	List<Entity> responseJSON;

	public List<Entity> getResponseJSON() {
		return responseJSON;
	}

	public void setResponseJSON(List<Entity> responseJSON) {
		this.responseJSON = responseJSON;
	}
}
