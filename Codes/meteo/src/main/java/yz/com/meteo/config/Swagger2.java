package yz.com.meteo.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;

import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger2 {

	// 定义分隔符,配置Swagger多包
	private static final String splitor = ";";

	/**
	 * 创建API应用 apiInfo() 增加API相关信息
	 * 通过select()函数返回一个ApiSelectorBuilder实例,用来控制哪些接口暴露给Swagger来展现，
	 * 本例采用指定扫描的包路径来定义指定要建立API的目录。
	 * 
	 * @return
	 */
	@Bean
	public Docket createRestApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
//					RequestHandlerSelectors.basePackage
				.apis(basePackage("yz.com.meteo" + splitor + "yz.com.resource.services" + splitor
						+ "yz.com.product.services"))
				.paths(PathSelectors.any()).build().securitySchemes(securitySchemes())
				.securityContexts(securityContexts());
	}

	private List<ApiKey> securitySchemes() {
		List<ApiKey> apiKeyList = new ArrayList<ApiKey>();
		apiKeyList.add(new ApiKey("Authorization", "Authorization", "header"));
		return apiKeyList;
	}

	private List<SecurityContext> securityContexts() {
		List<SecurityContext> securityContexts = new ArrayList<>();
		securityContexts.add(SecurityContext.builder().securityReferences(defaultAuth())
				.forPaths(PathSelectors.regex("^(?!auth).*$")).build());
		return securityContexts;
	}

	List<SecurityReference> defaultAuth() {
		AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
		AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
		authorizationScopes[0] = authorizationScope;
		List<SecurityReference> securityReferences = new ArrayList<>();
		securityReferences.add(new SecurityReference("Authorization", authorizationScopes));
		return securityReferences;
	}

	/**
	 * 创建该API的基本信息（这些基本信息会展现在文档页面中） 访问地址：http://项目实际地址/swagger-ui.html
	 * 
	 * @return
	 */
	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("福建农业气象业务平台服务接口列表")
		// .description("更多请关注http://www.baidu.com")
		// .termsOfServiceUrl("http://www.baidu.com")
//				.contact(new Contact("wangx", "", ""))
				.version("1.1.1").build();
	}

	/**
	 * 重写basePackage方法，使能够实现多包访问，复制贴上去
	 */
	public static Predicate<RequestHandler> basePackage(final String basePackage) {
		return input -> declaringClass(input).transform(handlerPackage(basePackage)).or(true);
	}

	private static Function<Class<?>, Boolean> handlerPackage(final String basePackage) {
		return input -> {
			// 循环判断匹配
			for (String strPackage : basePackage.split(splitor)) {
				boolean isMatch = input.getPackage().getName().startsWith(strPackage);
				if (isMatch) {
					return true;
				}
			}
			return false;
		};
	}

	@SuppressWarnings("deprecation")
	private static Optional<? extends Class<?>> declaringClass(RequestHandler input) {
		return Optional.fromNullable(input.declaringClass());
	}
}