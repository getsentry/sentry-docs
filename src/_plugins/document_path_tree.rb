Jekyll::Hooks.register :site, :pre_render, priority: :low do |site|
  def tree_for(docs, root)
    tree = []

    groups = docs.group_by do |doc|
      doc.relative_path.gsub(root, '').split('/').first
    end

    groups.each do |name, docs_for_group|
      new_root = if root.empty?
        "#{name}/"
      elsif !name.include? "."
        "#{root}#{name}/"
      else
        nil
      end

      document = if new_root
        docs_for_group.detect {|doc| doc.path.include? "#{new_root}index."}
      else
        docs_for_group.detect {|doc| doc.path.include? "#{root}#{name}"}
      end

      docs_without_index = docs_for_group.reject {|doc| doc.path.include? "#{new_root}index." }

      items = new_root.nil? ? nil : tree_for(docs_without_index, new_root)

      if !items.nil?
        items.sort_by! do |i|
          n = if !i["document"].nil? && i["document"].data["sidebar_order"]
            i["document"].data["sidebar_order"]
          else
            1000
          end
        end
      end

      hash = {
        "slug" => name,
        "name" => document.nil? ? name : document.data["title"],
        "document" => document.nil? ? nil : document,
        "items" => items,
        "parent_path" => new_root
      }

      tree.push hash
    end
    tree
  end

  mapped = site.collections.map {|c| c[1].docs}
  documents = mapped.flatten()
  tree = tree_for(documents, "")

  # relocate some items
  def adjacent_move(item, stack)
    # TODO: we might have to support direct parent as well
    parent = stack[stack.size - 2]
    if !parent.nil? && !item["document"].nil?
      other_sidebar = item["document"].data["sidebar_relocation"]
      if !other_sidebar.nil? && parent["items"]
        parent["items"].each do |parent_item|
          if parent_item["slug"] == other_sidebar
            parent_item["items"].push item
            return nil
          end
        end
      end
    end

    if !item["items"].nil?
      item["items"] = item["items"].map { |child| adjacent_move(child, stack + [item]) }.compact
    end
    item
  end

  tree = tree.map { |item| adjacent_move(item, []) }

  tree.each do |collection|
    config_slug = "#{collection["name"]}_categories"
    config_slug[0] = ""

    if (config = site.data[config_slug])
      collection["items"].sort_by! do |item|
        i = if (cat = config.find_index {|i| i["slug"].eql? item["slug"]})
          cat
        else
          0
        end
        i
      end
    end
  end

  site.config["document_tree"] = tree
end
