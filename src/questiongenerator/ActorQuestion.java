package questiongenerator;

public class ActorQuestion extends Question{
	
	public ActorQuestion(){
		request = 	"prefix db-owl: <http://dbpedia.org/ontology/>"
					+"prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
					+ "PREFIX dbp: <http://dbpedia.org/property/>"
					+ "select distinct (str(?name) as ?n) (str(?country) as ?cnt) (str(?birthYear) as ?date) where {"
					+ "?actor a db-owl:Actor ;"
					+ "foaf:name ?name;"
					+ "db-owl:nationality ?nationality;"
					+ "db-owl:birthYear ?birthYear."
					+ "?nationality dbp:commonName ?country."
					+ "FILTER regex(?name, '^((?![éàè,]).)*$')"
					+ "}"
					+ "limit 10";
	}
}
