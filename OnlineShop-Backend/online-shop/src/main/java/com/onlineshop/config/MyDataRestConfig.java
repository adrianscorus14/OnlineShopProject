package com.onlineshop.config;


import com.onlineshop.entity.Country;
import com.onlineshop.entity.Product;
import com.onlineshop.entity.ProductCategory;
import com.onlineshop.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager){
        this.entityManager=entityManager;
    }



    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions={HttpMethod.DELETE,HttpMethod.POST,HttpMethod.PUT};

        //disable HTTP methods for Product :PUT , POST ,DELETE
        disableHttpMethods(Product.class,config, unsupportedActions);

        //disable HTTP methods for ProductCategory :PUT , POST ,DELETE
        disableHttpMethods(ProductCategory.class,config, unsupportedActions);

        //disable HTTP methods for Country :PUT , POST ,DELETE
        disableHttpMethods(Country.class,config, unsupportedActions);

        //disable HTTP methods for State :PUT , POST ,DELETE
        disableHttpMethods(State.class,config, unsupportedActions);

        //exposing ids for the frontend
        exposeIds(config);

    }

    private void disableHttpMethods(Class theClass ,RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();

        List<Class> entityClasses=new ArrayList<>();

        for(EntityType tempEntityType:entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        Class[] domainTypes=entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }

}
