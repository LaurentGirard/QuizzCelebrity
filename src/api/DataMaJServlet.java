package api;

import java.io.IOException;
import javax.servlet.http.*;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.rdf.model.Literal;

import questiongenerator.Generator;


@SuppressWarnings("serial")
public class DataMaJServlet extends HttpServlet {
	private DatastoreService datastore;
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world455");
		
		datastore = DatastoreServiceFactory.getDatastoreService();
		
		majTheme("actor", datastore);
		majTheme("musician", datastore);
	}
	
	public void majTheme(String theme, DatastoreService datastore){
		
		Entity p;
		
		Literal name, date, country, image;
		
		Generator generator = new Generator(theme);
		
		QueryExecution qexec = QueryExecutionFactory.sparqlService("http://dbpedia.org/sparql", generator.getType_question().getRequest());

		ResultSet results = qexec.execSelect();
		
		while (results.hasNext())
		{
			QuerySolution binding = results.nextSolution();

			name = binding.getLiteral("n");
			date = binding.getLiteral("date");
			country = binding.getLiteral("cnt");
			image = binding.getLiteral("img");
			
			p = new Entity("Person", name.toString());
			
			p.setProperty("Name", name.toString());
			p.setProperty("Date", date.toString());
			p.setProperty("Country", country.toString());
			p.setProperty("Image", image.toString());
			p.setProperty("thème", theme);
		
			datastore.put(p);
		}
		
		qexec.close() ;
		
	}
}
